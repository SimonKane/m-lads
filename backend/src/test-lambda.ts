/**
 * Lambda Integration Test Script
 * 
 * This script demonstrates how to use the incident action services
 * with mock Lambda data. Run with: npm run test-lambda
 */

import {
  executeIncidentAction,
  executeMultipleIncidentActions,
  getExecutionSummary,
  canExecuteAction,
} from "./services/incidentActionService"
import { incidentArray, Incident } from "./models/incidentModel"

// Helper function to get incident by ID (avoiding controller dependency)
function getIncidentById(id: string): Incident | undefined {
  return incidentArray.find((incident) => incident.id === id)
}

// Helper function to print section headers
function printHeader(title: string) {
  console.log("\n" + "=".repeat(60))
  console.log(`  ${title}`)
  console.log("=".repeat(60) + "\n")
}

// Helper function to print test results
function printResult(result: any) {
  console.log("\n📋 Result:")
  console.log(`  Incident ID: ${result.incidentId}`)
  console.log(`  Action: ${result.action}`)
  console.log(`  Success: ${result.success ? "✅ Yes" : "❌ No"}`)
  console.log(`  Message: ${result.message}`)
  if (result.lambdaResponse) {
    console.log(`  Execution ID: ${result.lambdaResponse.executionId}`)
  }
  if (result.error) {
    console.log(`  Error: ${result.error}`)
  }
  console.log()
}

// Main test function
async function runTests() {
  console.log("\n🧪 Starting Lambda Integration Tests with Mock Data\n")

  // =========================================================================
  // TEST 1: Scale Up Database (incident-1)
  // =========================================================================
  printHeader("TEST 1: Scale Up Database (Critical Priority)")

  const incident1 = getIncidentById("incident-1")
  if (incident1) {
    console.log("📝 Incident Details:")
    console.log(`  Title: ${incident1.title}`)
    console.log(`  Status: ${incident1.status}`)
    console.log(`  Priority: ${incident1.priority}`)
    console.log(`  AI Action: ${incident1.aiAnalysis?.action}`)
    console.log(`  Target: ${incident1.aiAnalysis?.target}`)

    console.log("\n🔍 Checking if action can execute...")
    const canExecute = canExecuteAction(incident1)
    console.log(`  Can Execute: ${canExecute ? "✅ Yes" : "❌ No"}`)

    if (canExecute) {
      console.log("\n🚀 Executing action...")
      const result = await executeIncidentAction(incident1)
      printResult(result)
    }
  }

  // =========================================================================
  // TEST 2: Clear Cache (incident-3)
  // =========================================================================
  printHeader("TEST 2: Clear Cache (Medium Priority)")

  const incident3 = getIncidentById("incident-3")
  if (incident3) {
    console.log("📝 Incident Details:")
    console.log(`  Title: ${incident3.title}`)
    console.log(`  Status: ${incident3.status}`)
    console.log(`  Priority: ${incident3.priority}`)
    console.log(`  AI Action: ${incident3.aiAnalysis?.action}`)
    console.log(`  Target: ${incident3.aiAnalysis?.target}`)

    console.log("\n🔍 Checking if action can execute...")
    const canExecute = canExecuteAction(incident3)
    console.log(`  Can Execute: ${canExecute ? "✅ Yes" : "❌ No"}`)

    if (!canExecute) {
      console.log("  ⚠️  Incident is already resolved, skipping execution")
    } else {
      console.log("\n🚀 Executing action...")
      const result = await executeIncidentAction(incident3)
      printResult(result)
    }
  }

  // =========================================================================
  // TEST 3: Notify Human (incident-2)
  // =========================================================================
  printHeader("TEST 3: Notify Human (High Priority)")

  const incident2 = getIncidentById("incident-2")
  if (incident2) {
    console.log("📝 Incident Details:")
    console.log(`  Title: ${incident2.title}`)
    console.log(`  Status: ${incident2.status}`)
    console.log(`  Priority: ${incident2.priority}`)
    console.log(`  AI Action: ${incident2.aiAnalysis?.action}`)
    console.log(`  Target: ${incident2.aiAnalysis?.target || "N/A"}`)

    console.log("\n🚀 Executing action...")
    const result = await executeIncidentAction(incident2)
    printResult(result)
  }

  // =========================================================================
  // TEST 4: Action with "none" (incident-5)
  // =========================================================================
  printHeader("TEST 4: No Action Required (Low Priority)")

  const incident5 = getIncidentById("incident-5")
  if (incident5) {
    console.log("📝 Incident Details:")
    console.log(`  Title: ${incident5.title}`)
    console.log(`  Status: ${incident5.status}`)
    console.log(`  Priority: ${incident5.priority}`)
    console.log(`  AI Action: ${incident5.aiAnalysis?.action}`)

    console.log("\n🔍 Checking if action can execute...")
    const canExecute = canExecuteAction(incident5)
    console.log(`  Can Execute: ${canExecute ? "✅ Yes" : "❌ No"}`)

    if (!canExecute) {
      console.log("  ℹ️  Action is 'none' or incident is closed")
    }
  }

  // =========================================================================
  // TEST 5: Execute Multiple Incidents
  // =========================================================================
  printHeader("TEST 5: Execute Actions for Multiple Incidents")

  console.log("📝 Filtering open/investigating incidents...")
  const pendingIncidents = incidentArray.filter(
    (incident) =>
      incident.status === "open" || incident.status === "investigating"
  )

  console.log(`  Found ${pendingIncidents.length} pending incidents:\n`)
  pendingIncidents.forEach((inc) => {
    console.log(`  - ${inc.id}: ${inc.title} (${inc.aiAnalysis?.action})`)
  })

  console.log("\n🚀 Executing all actions...")
  const results = await executeMultipleIncidentActions(pendingIncidents)

  console.log("\n📊 Individual Results:")
  results.forEach((result, index) => {
    console.log(`\n  ${index + 1}. ${result.incidentId}:`)
    console.log(`     Action: ${result.action}`)
    console.log(`     Success: ${result.success ? "✅" : "❌"}`)
    console.log(`     Message: ${result.message}`)
  })

  const summary = getExecutionSummary(results)
  console.log("\n📈 Execution Summary:")
  console.log(`  Total: ${summary.total}`)
  console.log(`  ✅ Successful: ${summary.successful}`)
  console.log(`  ❌ Failed: ${summary.failed}`)
  console.log(`  ⏭️  Skipped: ${summary.skipped}`)

  // =========================================================================
  // TEST 6: Error Handling - Invalid Target
  // =========================================================================
  printHeader("TEST 6: Error Handling - Invalid Scenario")

  console.log("📝 Testing with incident without AI analysis...")
  const testIncident = {
    id: "test-999",
    title: "Test Incident",
    description: "This incident has no AI analysis",
    status: "open" as const,
    priority: "low" as const,
    createdAt: new Date(),
    // No aiAnalysis field
  }

  const result = await executeIncidentAction(testIncident)
  printResult(result)

  // =========================================================================
  // FINAL SUMMARY
  // =========================================================================
  printHeader("✅ All Tests Completed")

  console.log("Summary of what was tested:")
  console.log("  ✅ Scale up database (critical priority)")
  console.log("  ⚠️  Clear cache (resolved status - correctly skipped)")
  console.log("  ✅ Notify human (high priority)")
  console.log("  ⏭️  No action required (correctly skipped)")
  console.log("  ✅ Multiple incidents execution")
  console.log("  ✅ Error handling for missing AI analysis")

  console.log("\n💡 Next Steps:")
  console.log("  1. Integrate this into your controllers")
  console.log("  2. Update incident status after successful actions")
  console.log("  3. Deploy real Lambda functions when ready")
  console.log("  4. Switch from mock to production in .env")

  console.log("\n📚 Documentation:")
  console.log("  - Usage guide: docs/lambda-integration-guide.md")
  console.log("  - Lambda setup: docs/lambda-functions.md")
  console.log()
}

// Run the tests
runTests().catch((error) => {
  console.error("\n❌ Test execution failed:", error)
  process.exit(1)
})
