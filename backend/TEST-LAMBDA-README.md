# Testing Lambda Integration with Mock Data

This guide shows you how to test the Lambda integration using the mock service.

## Quick Start

Run the test script from the backend directory:

```bash
cd backend
npm run test-lambda
```

## What the Test Does

The test script demonstrates 6 different scenarios:

### 1. Scale Up Database (Critical Priority)
- Tests `scale_up` action on incident-1
- Shows database scaling for critical priority
- Target: `database`

### 2. Clear Cache (Resolved Status)
- Tests `clear_cache` action on incident-3
- Demonstrates that resolved incidents are correctly skipped
- Target: `cache`

### 3. Notify Human (High Priority)
- Tests `notify_human` action on incident-2
- Shows human notification for manual intervention
- Target: `null` (no target needed)

### 4. No Action Required
- Tests incident-5 with `none` action
- Shows how incidents without actions are handled

### 5. Execute Multiple Incidents
- Executes actions on all open/investigating incidents
- Shows batch processing capabilities
- Displays execution summary

### 6. Error Handling
- Tests incident without AI analysis
- Demonstrates proper error handling

## Expected Output

You'll see detailed console output including:

```
🧪 Starting Lambda Integration Tests with Mock Data

============================================================
  TEST 1: Scale Up Database (Critical Priority)
============================================================

📝 Incident Details:
  Title: Database Connection Timeout
  Status: investigating
  Priority: critical
  AI Action: scale_up
  Target: database

🔍 Checking if action can execute...
  Can Execute: ✅ Yes

🚀 Executing action...
🚀 [MOCK LAMBDA] Invoking Lambda function...
📦 Payload: {
  "action": "scale_up",
  "target": "database",
  "incidentId": "incident-1",
  "priority": "critical"
}
✅ [MOCK] Scaling up resource: database
   Priority: critical

📋 Result:
  Incident ID: incident-1
  Action: scale_up
  Success: ✅ Yes
  Message: Action "scale_up" executed successfully
  Execution ID: scale-1234567890
```

## Understanding Mock Behavior

The mock Lambda service:
- ✅ Simulates real Lambda calls
- ⏱️ Adds 500ms delay (simulating network latency)
- 📝 Logs detailed information to console
- ✅ Returns success responses
- 🔍 Validates action-target combinations

## Key Features Demonstrated

1. **Action Validation** - Only valid action-target pairs are executed
2. **Status Checking** - Resolved/closed incidents are skipped
3. **Error Handling** - Missing AI analysis handled gracefully
4. **Batch Processing** - Multiple incidents executed sequentially
5. **Execution Summary** - Statistics on success/failure/skipped

## What You Can Change

### Test Different Scenarios

Edit `src/test-lambda.ts` to:
- Test specific incidents
- Add custom test cases
- Modify incident data
- Test error scenarios

### Modify Mock Behavior

Edit `src/services/lambdaService.ts` to:
- Change delay timing
- Modify mock responses
- Add custom logging
- Simulate failures

## Using in Your Code

### Example: Execute Action in Controller

```typescript
import { executeIncidentAction } from '../services/incidentActionService'
import { getIncidentById, updateIncident } from '../models/incidentModel'

export async function executeAction(req: Request, res: Response) {
  const { incidentId } = req.params
  
  const incident = getIncidentById(incidentId)
  
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' })
  }

  const result = await executeIncidentAction(incident)
  
  if (result.success) {
    // Update incident status
    updateIncident(incidentId, { status: 'investigating' })
    
    return res.json({
      success: true,
      message: result.message,
      executionId: result.lambdaResponse?.executionId
    })
  } else {
    return res.status(500).json({
      success: false,
      error: result.error
    })
  }
}
```

## Switching to Real AWS Lambda

When ready for production:

1. Deploy Lambda functions (see `docs/lambda-functions.md`)
2. Update `.env`:
   ```env
   USE_MOCK_LAMBDA=false
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   LAMBDA_RESTART_SERVICE_ARN=arn:aws:lambda:...
   ```
3. Uncomment AWS SDK code in `lambdaService.ts`
4. Install AWS SDK: `npm install @aws-sdk/client-lambda`

## Troubleshooting

### "Cannot find module" errors
- Make sure you're in the `backend` directory
- Run `npm install` if needed

### TypeScript errors
- Check that all imports are correct
- Ensure `@types/node` is installed

### Test doesn't run
- Verify `ts-node` is installed: `npm list ts-node`
- Try: `npx ts-node src/test-lambda.ts`

## Next Steps

1. ✅ Run the test to see mock Lambda in action
2. 📝 Integrate into your controllers/routes
3. 🧪 Write additional tests for edge cases
4. 🚀 Deploy to AWS when ready

## Additional Resources

- [Lambda Integration Guide](../docs/lambda-integration-guide.md) - Usage examples
- [Lambda Functions Documentation](../docs/lambda-functions.md) - AWS deployment
- [Incident Model](./src/models/incidentModel.ts) - Data structure
