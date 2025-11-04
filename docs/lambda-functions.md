# AWS Lambda Functions Documentation

This document provides templates and instructions for creating AWS Lambda functions to handle incident actions.

## Overview

The incident management system uses AWS Lambda functions to automatically resolve infrastructure issues. Each action type (`restart_service`, `scale_up`, `clear_cache`, `notify_human`) is handled by a separate Lambda function.

## Lambda Function Architecture

```
Backend API
    ↓
  Lambda Service (invokeLambda)
    ↓
  AWS Lambda Function
    ↓
  AWS Services (EC2, RDS, ElastiCache, SNS, etc.)
```

## Required Lambda Functions

### 1. Restart Service Lambda

**Function Name:** `incident-restart-service`  
**Runtime:** Node.js 18.x  
**Timeout:** 30 seconds  
**Memory:** 256 MB

**Purpose:** Restart application services (API, auth services, etc.)

**IAM Permissions Needed:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ec2:RebootInstances",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

**Lambda Function Template:**
```javascript
// lambda-restart-service.js
const { ECSClient, UpdateServiceCommand } = require("@aws-sdk/client-ecs");

const ecsClient = new ECSClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { target, incidentId, priority } = event;

  try {
    // Map target to ECS service name
    const serviceName = mapTargetToService(target);
    const clusterName = process.env.ECS_CLUSTER_NAME;

    // Force a new deployment to restart the service
    const command = new UpdateServiceCommand({
      cluster: clusterName,
      service: serviceName,
      forceNewDeployment: true,
    });

    const response = await ecsClient.send(command);

    console.log(`Service ${serviceName} restart initiated`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Service ${serviceName} restart initiated`,
        incidentId,
        service: serviceName,
        taskArn: response.service?.taskDefinition,
      }),
    };
  } catch (error) {
    console.error("Error restarting service:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to restart service",
        error: error.message,
        incidentId,
      }),
    };
  }
};

function mapTargetToService(target) {
  const serviceMap = {
    api: "production-api-service",
    "auth-service": "production-auth-service",
  };
  return serviceMap[target] || "default-service";
}
```

---

### 2. Scale Up Lambda

**Function Name:** `incident-scale-up`  
**Runtime:** Node.js 18.x  
**Timeout:** 60 seconds  
**Memory:** 256 MB

**Purpose:** Scale up resources (databases, API services, cache)

**IAM Permissions Needed:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:ModifyDBInstance",
        "rds:DescribeDBInstances",
        "ecs:UpdateService",
        "elasticache:ModifyCacheCluster",
        "application-autoscaling:RegisterScalableTarget",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

**Lambda Function Template:**
```javascript
// lambda-scale-up.js
const { RDSClient, ModifyDBInstanceCommand } = require("@aws-sdk/client-rds");
const { ECSClient, UpdateServiceCommand } = require("@aws-sdk/client-ecs");

const rdsClient = new RDSClient({ region: process.env.AWS_REGION });
const ecsClient = new ECSClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { target, incidentId, priority } = event;

  try {
    let result;

    switch (target) {
      case "database":
        result = await scaleDatabase(priority);
        break;
      case "api":
        result = await scaleAPIService(priority);
        break;
      case "cache":
        result = await scaleCache(priority);
        break;
      default:
        throw new Error(`Unknown target: ${target}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully scaled up ${target}`,
        incidentId,
        details: result,
      }),
    };
  } catch (error) {
    console.error("Error scaling resource:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to scale resource",
        error: error.message,
        incidentId,
      }),
    };
  }
};

async function scaleDatabase(priority) {
  const instanceClass = priority === "critical" ? "db.r5.2xlarge" : "db.r5.xlarge";
  
  const command = new ModifyDBInstanceCommand({
    DBInstanceIdentifier: process.env.DB_INSTANCE_ID,
    DBInstanceClass: instanceClass,
    ApplyImmediately: true,
  });

  const response = await rdsClient.send(command);
  return { instanceClass, status: response.DBInstance.DBInstanceStatus };
}

async function scaleAPIService(priority) {
  const desiredCount = priority === "critical" ? 10 : 5;
  
  const command = new UpdateServiceCommand({
    cluster: process.env.ECS_CLUSTER_NAME,
    service: "production-api-service",
    desiredCount,
  });

  const response = await ecsClient.send(command);
  return { desiredCount, status: response.service.status };
}

async function scaleCache(priority) {
  // ElastiCache scaling logic
  return { message: "Cache scaling initiated" };
}
```

---

### 3. Clear Cache Lambda

**Function Name:** `incident-clear-cache`  
**Runtime:** Node.js 18.x  
**Timeout:** 30 seconds  
**Memory:** 256 MB

**Purpose:** Clear cache to resolve memory or stale data issues

**IAM Permissions Needed:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticache:DescribeCacheClusters",
        "elasticache:RebootCacheCluster",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

**Lambda Function Template:**
```javascript
// lambda-clear-cache.js
const { ElastiCacheClient, RebootCacheClusterCommand } = require("@aws-sdk/client-elasticache");
const Redis = require("ioredis");

const elastiCacheClient = new ElastiCacheClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { target, incidentId, priority } = event;

  try {
    if (target === "cache") {
      // Option 1: Flush Redis cache using direct connection
      const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      });

      await redis.flushall();
      await redis.quit();

      console.log("Cache cleared successfully");

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Cache cleared successfully",
          incidentId,
          target,
        }),
      };

      // Option 2: Reboot cache cluster (more aggressive)
      // const command = new RebootCacheClusterCommand({
      //   CacheClusterId: process.env.CACHE_CLUSTER_ID,
      //   CacheNodeIdsToReboot: ["0001"],
      // });
      // await elastiCacheClient.send(command);
    }

    throw new Error(`Invalid target for clear_cache: ${target}`);
  } catch (error) {
    console.error("Error clearing cache:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to clear cache",
        error: error.message,
        incidentId,
      }),
    };
  }
};
```

---

### 4. Notify Human Lambda

**Function Name:** `incident-notify-human`  
**Runtime:** Node.js 18.x  
**Timeout:** 15 seconds  
**Memory:** 128 MB

**Purpose:** Send notifications to on-call engineers via email, SMS, Slack, etc.

**IAM Permissions Needed:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

**Lambda Function Template:**
```javascript
// lambda-notify-human.js
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { incidentId, priority, incidentDetails } = event;

  try {
    const message = formatNotificationMessage(incidentDetails, incidentId, priority);

    // Send SNS notification
    const command = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: `🚨 [${priority.toUpperCase()}] Incident ${incidentId} requires attention`,
      Message: message,
    });

    const response = await snsClient.send(command);

    console.log("Notification sent:", response.MessageId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Notification sent successfully",
        incidentId,
        messageId: response.MessageId,
      }),
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send notification",
        error: error.message,
        incidentId,
      }),
    };
  }
};

function formatNotificationMessage(incidentDetails, incidentId, priority) {
  return `
🚨 INCIDENT ALERT 🚨

Incident ID: ${incidentId}
Priority: ${priority}

Title: ${incidentDetails.title}
Description: ${incidentDetails.description}

This incident requires immediate human attention.

Please log in to the incident management system to review and resolve.
  `.trim();
}
```

---

## Deployment Instructions

### 1. Using AWS Console

1. Go to AWS Lambda console
2. Click "Create function"
3. Choose "Author from scratch"
4. Configure:
   - Function name: (e.g., `incident-restart-service`)
   - Runtime: Node.js 18.x
   - Architecture: x86_64
5. Copy the function code from templates above
6. Configure environment variables (see below)
7. Set timeout and memory as specified
8. Attach IAM role with required permissions
9. Deploy the function

### 2. Using AWS CLI

```bash
# Create deployment package
zip function.zip lambda-restart-service.js

# Create function
aws lambda create-function \
  --function-name incident-restart-service \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --handler lambda-restart-service.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 256
```

### 3. Using Infrastructure as Code (Terraform)

```hcl
resource "aws_lambda_function" "restart_service" {
  filename         = "lambda-restart-service.zip"
  function_name    = "incident-restart-service"
  role            = aws_iam_role.lambda_role.arn
  handler         = "lambda-restart-service.handler"
  source_code_hash = filebase64sha256("lambda-restart-service.zip")
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 256

  environment {
    variables = {
      ECS_CLUSTER_NAME = "production-cluster"
      AWS_REGION      = "us-east-1"
    }
  }
}
```

---

## Environment Variables

Each Lambda function needs specific environment variables:

**restart-service:**
- `ECS_CLUSTER_NAME`: Name of ECS cluster
- `AWS_REGION`: AWS region

**scale-up:**
- `ECS_CLUSTER_NAME`: Name of ECS cluster
- `DB_INSTANCE_ID`: RDS instance identifier
- `AWS_REGION`: AWS region

**clear-cache:**
- `REDIS_HOST`: Redis endpoint
- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASSWORD`: Redis password
- `CACHE_CLUSTER_ID`: ElastiCache cluster ID (if using reboot option)
- `AWS_REGION`: AWS region

**notify-human:**
- `SNS_TOPIC_ARN`: ARN of SNS topic for notifications
- `AWS_REGION`: AWS region

---

## Testing Lambda Functions

### Using AWS Console Test Events

Example test event:
```json
{
  "action": "scale_up",
  "target": "database",
  "incidentId": "incident-1",
  "priority": "critical"
}
```

### Using AWS CLI

```bash
aws lambda invoke \
  --function-name incident-restart-service \
  --payload '{"action":"restart_service","target":"api","incidentId":"test-1","priority":"high"}' \
  response.json
```

---

## Monitoring and Logging

1. **CloudWatch Logs**: All Lambda functions automatically log to CloudWatch
2. **CloudWatch Metrics**: Monitor invocation count, duration, errors
3. **X-Ray**: Enable for distributed tracing
4. **Alarms**: Set up CloudWatch alarms for function failures

---

## Security Best Practices

1. **Use least privilege IAM roles**: Only grant necessary permissions
2. **Encrypt environment variables**: Use AWS KMS for sensitive data
3. **Enable VPC if needed**: For accessing private resources
4. **Use Secrets Manager**: Store sensitive credentials (Redis password, etc.)
5. **Enable X-Ray tracing**: For debugging and monitoring
6. **Set appropriate timeouts**: Prevent long-running executions

---

## Cost Optimization

1. **Right-size memory**: Test different memory configurations
2. **Use reserved concurrency**: For predictable workloads
3. **Monitor invocation costs**: Set billing alarms
4. **Optimize code**: Reduce execution time
5. **Use Lambda Insights**: For performance optimization

---

## Troubleshooting

### Common Issues

**1. Timeout errors**
- Increase function timeout
- Optimize code execution
- Check external service response times

**2. Permission denied**
- Verify IAM role permissions
- Check resource policies

**3. Function not triggered**
- Verify Lambda ARN in backend configuration
- Check CloudWatch logs for invocation attempts

**4. Out of memory**
- Increase memory allocation
- Optimize code memory usage

---

## Next Steps

1. Deploy Lambda functions to AWS
2. Update backend `.env` file with Lambda ARNs
3. Switch from mock Lambda service to real AWS SDK implementation
4. Test with real incidents
5. Monitor and optimize
