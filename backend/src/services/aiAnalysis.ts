import "dotenv/config";
import OpenAI from "openai";
import { Incident, itStaff } from "../models/incidentModel";

type AnalysisResult = NonNullable<Incident["aiAnalysis"]>;
type AssignmentResult = AnalysisResult & { assignedTo: string };

console.log("API Key loaded:", process.env.API_KEY ? "✓ Yes" : "✗ No");

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Incident Manager",
  },
});

// Normalize raw data from monitoring system to Incident format
export async function normalizeRawData(rawData: any): Promise<Incident> {
  const prompt = `You are an AI that normalizes surveillance data into a structured incident format.

Read the following raw data and create an incident description.

Respond ONLY with a JSON object in this format (no other text):
{
  "title": "Short, describing title (maximum 10 words)",
  "description": "detailed description that summarizes the problem, include all relevant info from the logs and metrics",
  "status": "open",
  "priority": "critical" | "high" | "medium" | "low"
}

Raw data:
${JSON.stringify(rawData, null, 2)}`;

  try {
    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error("No response from ai AI");
    }

    const normalized = JSON.parse(responseText);

    // Create a complete Incident object
    const incident: Incident = {
      id: `incident-${Date.now()}`,
      title: normalized.title,
      description: normalized.description,
      status: normalized.status || "open",
      priority: normalized.priority || "medium",
      createdAt: new Date(),
    };

    return incident;
  } catch (error) {
    console.error("Error during normalizing:", error);
    // Fallback
    return {
      id: `incident-${Date.now()}`,
      title: "unknown incident",
      description: `Raw data could not be normalized: ${JSON.stringify(
        rawData
      ).substring(0, 200)}`,
      status: "open",
      priority: "medium",
      createdAt: new Date(),
    };
  }
}

export async function analyzeIncident(
  incident: Incident
): Promise<AssignmentResult> {
  // Create a list of available staff
  const staffList = itStaff
    .map((person) => `- ${person.name} (${person.specialization})`)
    .join("\n");

  const prompt = `You are an AI that analyzes IT-incidents and assigns them to the correct IT-staff.

Available staff:
${staffList}
Read the text below and classify the incident according to the following rules:

- If the incident involves "down", "crashed" → type: "server_down", priority: "critical", action: "restart_service"
- If the incident involves "cpu", "slow" → type: "high_cpu", priority: "high", action: "scale_up"
- If the incident involves "memory", "leak" → type: "memory_leak", priority: "high", action: "clear_cache"
- Otherwise → type: "unknown", priority: "medium", action: "notify_human"

Assign the incident to the person who's specialization suits the incident best.

Answer ONLY with a JSON-object in this format (no other text):

{
  "type": "server_down" | "high_cpu" | "memory_leak" | "unknown",
  "priority": "critical" | "high" | "medium" | "low",
  "action": "restart_service" | "scale_up" | "clear_cache" | "notify_human" | "none",
  "target": "Name of the affected service, otherwise null",
  "assignedTo": "Name of the person who should handle the incident (Anna, Johan or Lisa)",
  "recommendation": "A short description of what should be done"
} 

Incident:
Title: ${incident.title}
Description: ${incident.description}`;

  try {
    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(responseText) as AssignmentResult;
    return result;
  } catch (error) {
    console.error("Error during AI-analysis:", error);
    // Fallback in case of error
    return {
      type: "unknown",
      priority: "medium",
      action: "notify_human",
      target: null,
      assignedTo: "AI Assistant",
      recommendation:
        "Could not analyze the incident. Manual review required.",
    };
  }
}

// Send notification to Slack when someone is assigned an incident
export async function notifyAssignedPerson(
  incident: Incident,
  analysis: AssignmentResult
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("❌ SLACK_WEBHOOK_URL is not configured in .env");
    return;
  }

  // Find the assigned person to get more information
  const assignedPerson = itStaff.find(
    (person) => person.name === analysis.assignedTo
  );

  // Create a formatted message
  const message = `❗️ *New incident assigned: @${analysis.assignedTo}*

*Incident:* ${incident.title}
*ID:* ${incident.id}
*Priority:* ${analysis.priority.toUpperCase()}
*Type:* ${analysis.type}
*Target:* ${analysis.target || "N/A"}

*Description:*
${incident.description}

*Recommended action:* ${analysis.action}
*Recommendation:*
${analysis.recommendation}

${assignedPerson ? `*Specialization:* ${assignedPerson.specialization}` : ""}

*Created:* ${incident.createdAt.toISOString()}`;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    console.log(`Slack notification sent to ${analysis.assignedTo}!`);
  } catch (error) {
    console.error("Failed to send to Slack:", error);
  }
}

// Default export for backwards compatibility
export default analyzeIncident;
