/**
 * Incident Action Service
 * 
 * Handles execution of incident actions by invoking Lambda functions
 * and managing incident state updates.
 */

import { Incident } from "../models/incidentModel"
import {
  invokeLambda,
  createLambdaPayload,
  LambdaResponse,
} from "./lambdaService"

export interface ActionResult {
  success: boolean
  message: string
  incidentId: string
  action: string
  lambdaResponse?: LambdaResponse
  error?: string
}

/**
 * Execute an incident action
 * This function will invoke the appropriate Lambda function based on the incident's AI analysis
 */
export const executeIncidentAction = async (
  incident: Incident
): Promise<ActionResult> => {
  // Validate incident has AI analysis
  if (!incident.aiAnalysis) {
    return {
      success: false,
      message: "No AI analysis available for this incident",
      incidentId: incident.id,
      action: "none",
      error: "Missing aiAnalysis field",
    }
  }

  const { action } = incident.aiAnalysis

  // Skip execution for 'none' action
  if (action === "none") {
    return {
      success: true,
      message: "No action required for this incident",
      incidentId: incident.id,
      action: "none",
    }
  }

  // Create Lambda payload
  const payload = createLambdaPayload(incident)
  if (!payload) {
    return {
      success: false,
      message: "Failed to create Lambda payload",
      incidentId: incident.id,
      action,
      error: "Invalid payload generation",
    }
  }

  // Validate action-target combination
  const validationError = validateActionTarget(action, payload.target)
  if (validationError) {
    return {
      success: false,
      message: validationError,
      incidentId: incident.id,
      action,
      error: validationError,
    }
  }

  try {
    // Invoke Lambda function
    console.log(
      `🎯 Executing action "${action}" for incident ${incident.id}...`
    )
    const lambdaResponse = await invokeLambda(payload)

    if (lambdaResponse.success) {
      return {
        success: true,
        message: `Action "${action}" executed successfully`,
        incidentId: incident.id,
        action,
        lambdaResponse,
      }
    } else {
      return {
        success: false,
        message: `Action "${action}" failed: ${lambdaResponse.message}`,
        incidentId: incident.id,
        action,
        lambdaResponse,
        error: lambdaResponse.message,
      }
    }
  } catch (error) {
    console.error(`Error executing incident action:`, error)
    return {
      success: false,
      message: "Failed to execute incident action",
      incidentId: incident.id,
      action,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Validate action and target combination
 * Returns error message if invalid, null if valid
 */
const validateActionTarget = (
  action: string,
  target: string | null
): string | null => {
  switch (action) {
    case "restart_service":
      if (!target) {
        return "restart_service action requires a target"
      }
      if (target !== "api" && target !== "auth-service") {
        return `Invalid target for restart_service: ${target}`
      }
      break

    case "scale_up":
      if (!target) {
        return "scale_up action requires a target"
      }
      if (target !== "database" && target !== "api" && target !== "cache") {
        return `Invalid target for scale_up: ${target}`
      }
      break

    case "clear_cache":
      if (!target) {
        return "clear_cache action requires a target"
      }
      if (target !== "cache") {
        return `Invalid target for clear_cache: ${target}`
      }
      break

    case "notify_human":
      // notify_human doesn't require a target
      break

    default:
      return `Unknown action: ${action}`
  }

  return null
}

/**
 * Execute actions for multiple incidents
 */
export const executeMultipleIncidentActions = async (
  incidents: Incident[]
): Promise<ActionResult[]> => {
  const results: ActionResult[] = []

  for (const incident of incidents) {
    const result = await executeIncidentAction(incident)
    results.push(result)
  }

  return results
}

/**
 * Get action execution summary
 */
export const getExecutionSummary = (
  results: ActionResult[]
): {
  total: number
  successful: number
  failed: number
  skipped: number
} => {
  const summary = {
    total: results.length,
    successful: 0,
    failed: 0,
    skipped: 0,
  }

  results.forEach((result) => {
    if (result.action === "none") {
      summary.skipped++
    } else if (result.success) {
      summary.successful++
    } else {
      summary.failed++
    }
  })

  return summary
}

/**
 * Check if incident action can be executed
 */
export const canExecuteAction = (incident: Incident): boolean => {
  if (!incident.aiAnalysis) {
    return false
  }

  const { action } = incident.aiAnalysis

  // Can't execute if action is 'none'
  if (action === "none") {
    return false
  }

  // Can't execute if status is already resolved or closed
  if (incident.status === "resolved" || incident.status === "closed") {
    return false
  }

  return true
}
