# Lambda Integration Guide

This guide explains how to use the incident action services to execute AWS Lambda functions for automated incident resolution.

## Overview

The system currently uses **mock Lambda services** for development. When ready for production, you can easily switch to real AWS Lambda functions.

## Architecture

```
Incident Model (incidentModel.ts)
    ↓
Action Service (incidentActionService.ts)
    ↓
Lambda Service (lambdaService.ts) - MOCK or REAL
    ↓
AWS Lambda Functions (when in production)
```

## Getting Started

### 1. Import Required Services

```typescript
import { 
  executeIncidentAction,
  canExecuteAction 
} from '../services/incidentActionService'
import { getIncidentById } from '../models/incidentModel'
```

### 2. Execute an Incident Action

```typescript
// In your controller
const incident = getIncidentById('incident-1')

if (incident && canExecuteAction(incident)) {
  const result = await executeIncidentAction(incident)
  
  if (result.success) {
    console.log('Action executed:', result.message)
    // Update incident status to 'resolved' or 'investigating'
  } else {
    console.error('Action failed:', result.error)
  }
}
```

## Usage Examples

### Example 1: Execute Single Incident Action

```typescript
import { executeIncidentAction } from '../services/incidentActionService'
import { getIncidentById } from '../models/incidentModel'

async function handleIncidentAction(incidentId: string) {
  const incident = getIncidentById(incidentId)
  
  if (!incident) {
    return { error: 'Incident not found' }
  }

  const result = await executeIncidentAction(incident)
  
  return {
    incidentId: result.incidentId,
    action: result.action,
    success: result.success,
    message: result.message
  }
}
```

### Example 2: Execute Multiple Incidents

```typescript
import { 
  executeMultipleIncidentActions,
  getExecutionSummary 
} from '../services/incidentActionService'
import { getAllIncidents } from '../models/incidentModel'

async function executeAllPendingActions() {
  const incidents = getAllIncidents()
  
  // Filter only open/investigating incidents
  const pending = incidents.filter(
    i => i.status === 'open' || i.status === 'investigating'
  )

  const results = await executeMultipleIncidentActions(pending)
  const summary = getExecutionSummary(results)
  
  console.log(`Executed ${summary.total} actions:`)
  console.log(`  ✅ Successful: ${summary.successful}`)
  console.log(`  ❌ Failed: ${summary.failed}`)
  console.log(`  ⏭️  Skipped: ${summary.skipped}`)
  
  return summary
}
```

### Example 3: Check If Action Can Execute

```typescript
import { canExecuteAction } from '../services/incidentActionService'
import { getIncidentById } from '../models/incidentModel'

function isActionAvailable(incidentId: string): boolean {
  const incident = getIncidentById(incidentId)
  
  if (!incident) {
    return false
  }

  return canExecuteAction(incident)
}
```

## Mock vs Real Lambda

### Current Setup (Mock)

The system uses a mock Lambda service that:
- Simulates Lambda execution with console logs
- Returns mock responses after a 500ms delay
- Doesn't require AWS credentials
- Perfect for development and testing

**Console output example:**
```
🚀 [MOCK LAMBDA] Invoking Lambda function...
📦 Payload: {
  "action": "scale_up",
  "target": "database",
  "incidentId": "incident-1",
  "priority": "critical"
}
✅ [MOCK] Scaling up resource: database
   Priority: critical
```

### Switching to Real AWS Lambda

When ready for production:

1. **Deploy Lambda functions to AWS** (see `docs/lambda-functions.md`)

2. **Update `.env` file:**
```env
USE_MOCK_LAMBDA=false
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

LAMBDA_RESTART_SERVICE_ARN=arn:aws:lambda:...
LAMBDA_SCALE_UP_ARN=arn:aws:lambda:...
LAMBDA_CLEAR_CACHE_ARN=arn:aws:lambda:...
LAMBDA_NOTIFY_HUMAN_ARN=arn:aws:lambda:...
```

3. **Update `lambdaService.ts`:**
   - Uncomment the AWS SDK implementation section
   - Comment out the mock implementation
   - Update the export to use `invokeLambdaReal` instead of `invokeLambda`

4. **Install AWS SDK:**
```bash
npm install @aws-sdk/client-lambda
```

## Action Types and Requirements

### restart_service
- **Target Required:** Yes (`api`, `auth-service`)
- **Use Case:** Service crashed or unresponsive
- **Example:**
```typescript
{
  action: "restart_service",
  target: "api"
}
```

### scale_up
- **Target Required:** Yes (`database`, `api`, `cache`)
- **Use Case:** Resource running out of capacity
- **Example:**
```typescript
{
  action: "scale_up",
  target: "database"
}
```

### clear_cache
- **Target Required:** Yes (`cache`)
- **Use Case:** Cache memory issues or stale data
- **Example:**
```typescript
{
  action: "clear_cache",
  target: "cache"
}
```

### notify_human
- **Target Required:** No
- **Use Case:** Manual intervention needed
- **Example:**
```typescript
{
  action: "notify_human",
  target: null
}
```

### none
- **Target Required:** No
- **Use Case:** No automated action available
- **Execution:** Skipped automatically

## Response Types

### Success Response
```typescript
{
  success: true,
  message: "Action executed successfully",
  incidentId: "incident-1",
  action: "scale_up",
  lambdaResponse: {
    success: true,
    message: "Resource database scaling initiated",
    executionId: "scale-1234567890",
    timestamp: Date
  }
}
```

### Error Response
```typescript
{
  success: false,
  message: "Action failed: Invalid target",
  incidentId: "incident-2",
  action: "restart_service",
  error: "Invalid target for restart_service: invalid-target"
}
```

## Error Handling

The service handles various error scenarios:

1. **Missing AI Analysis**
```typescript
{
  success: false,
  message: "No AI analysis available for this incident",
  error: "Missing aiAnalysis field"
}
```

2. **Invalid Action-Target Combination**
```typescript
{
  success: false,
  message: "restart_service action requires a target",
  error: "restart_service action requires a target"
}
```

3. **Lambda Execution Failure**
```typescript
{
  success: false,
  message: "Failed to execute incident action",
  error: "Network timeout"
}
```

## Best Practices

### 1. Always Check Before Executing
```typescript
if (canExecuteAction(incident)) {
  await executeIncidentAction(incident)
}
```

### 2. Handle Errors Gracefully
```typescript
const result = await executeIncidentAction(incident)

if (!result.success) {
  // Log error
  console.error(`Action failed: ${result.error}`)
  
  // Update incident with error status
  updateIncident(incident.id, { 
    status: 'open',
    notes: `Action failed: ${result.error}` 
  })
  
  // Maybe notify human
  // ...
}
```

### 3. Log Execution Results
```typescript
const result = await executeIncidentAction(incident)

console.log({
  timestamp: new Date(),
  incidentId: result.incidentId,
  action: result.action,
  success: result.success,
  executionId: result.lambdaResponse?.executionId
})
```

### 4. Update Incident Status After Execution
```typescript
const result = await executeIncidentAction(incident)

if (result.success) {
  updateIncident(incident.id, { status: 'investigating' })
} else {
  // Maybe escalate or notify
}
```

## Testing

### Unit Testing Example

```typescript
import { executeIncidentAction } from '../services/incidentActionService'

describe('Incident Action Service', () => {
  it('should execute scale_up action', async () => {
    const incident = {
      id: 'test-1',
      title: 'Test',
      description: 'Test incident',
      status: 'open',
      priority: 'high',
      createdAt: new Date(),
      aiAnalysis: {
        type: 'Database',
        action: 'scale_up',
        target: 'database',
        priority: 'high',
        recommendation: 'Scale up'
      }
    }

    const result = await executeIncidentAction(incident)

    expect(result.success).toBe(true)
    expect(result.action).toBe('scale_up')
  })
})
```

## Troubleshooting

### Issue: "No AI analysis available"
**Solution:** Ensure incident has `aiAnalysis` field populated

### Issue: "Action requires a target"
**Solution:** Verify target is set correctly in incident.aiAnalysis

### Issue: "Cannot execute on resolved incident"
**Solution:** Check incident status before calling executeIncidentAction

### Issue: Mock Lambda not logging
**Solution:** Check console output, ensure USE_MOCK_LAMBDA=true in .env

## Next Steps

1. Your team can now use these services in controllers
2. Controllers should call `executeIncidentAction` when needed
3. Update incident status based on action results
4. Monitor Lambda execution in development
5. Deploy real Lambda functions when ready for production

## Additional Resources

- [Lambda Functions Documentation](./lambda-functions.md) - Complete Lambda deployment guide
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
