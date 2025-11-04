import { Incident } from "../models/incidentModel";
import {
  invokeLambda,
  createLambdaPayload,
  LambdaResponse,
} from "./lambdaService";
import dotenv from "dotenv";

dotenv.config();

/**
 * Skickar Slack-notifiering för AI-åtgärd
 */
async function sendAIActionNotification(
  incident: Incident,
  lambdaResponse: LambdaResponse
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const slackMessage = {
    text: `*AI-ASSISTENT ÅTGÄRDADE INCIDENT*`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `AI-assistent åtgärdade: ${incident.title}`,
          emoji: false,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Incident ID:*\n${incident.id}`,
          },
          {
            type: "mrkdwn",
            text: `*Prioritet:*\n${(
              incident.aiAnalysis?.priority || "medium"
            ).toUpperCase()}`,
          },
          {
            type: "mrkdwn",
            text: `*Typ:*\n${incident.aiAnalysis?.type || "unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `*Mål:*\n${incident.aiAnalysis?.target || "N/A"}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Problem:*\n${incident.description}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Åtgärd som utfördes:*\n${
            incident.aiAnalysis?.action || "N/A"
          }`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*AI Rekommendation:*\n${
            incident.aiAnalysis?.recommendation || "Ingen rekommendation"
          }`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Lambda-status:*\n${
            lambdaResponse.success ? "Lyckades" : "Misslyckades"
          } - ${lambdaResponse.message}`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Åtgärdad av AI-assistent - ${new Date().toLocaleString(
              "sv-SE"
            )}`,
          },
        ],
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackMessage),
    });
  } catch (error) {}
}

/**
 * Auto-fix funktion som kommunicerar med företagets Lambda (AWS)
 */
export async function attemptFix(incident: any) {
  const { action, target, recommendation } = incident.aiAnalysis || {};
  const assignedTo = (incident.aiAnalysis as any)?.assignedTo;

  if (!action || action === "none") {
    return {
      success: false,
      message: "Cannot auto fix this incident",
    };
  }

  let lambdaResponse: LambdaResponse | null = null;

  const lambdaPayload = createLambdaPayload(incident);

  if (!lambdaPayload) {
    return {
      success: false,
      message: "Failed to create Lambda payload",
    };
  }

  switch (action) {
    case "restart_service":
      lambdaResponse = await invokeLambda(lambdaPayload);
      console.log(
        `[LAMBDA SIMULERING] Åtgärd: Startar om tjänsten "${target}"`
      );
      console.log(
        `[LAMBDA SIMULERING] Status: ${
          lambdaResponse.success ? "Lyckades" : "Misslyckades"
        }`
      );
      console.log(`[LAMBDA SIMULERING] Meddelande: ${lambdaResponse.message}`);
      break;

    case "scale_up":
      lambdaResponse = await invokeLambda(lambdaPayload);
      console.log(
        `[LAMBDA SIMULERING] Åtgärd: Skalar upp tjänsten "${target}"`
      );
      console.log(
        `[LAMBDA SIMULERING] Status: ${
          lambdaResponse.success ? "Lyckades" : "Misslyckades"
        }`
      );
      console.log(`[LAMBDA SIMULERING] Meddelande: ${lambdaResponse.message}`);
      break;

    case "clear_cache":
      lambdaResponse = await invokeLambda(lambdaPayload);
      console.log(`[LAMBDA SIMULERING] Åtgärd: Rensar cache på "${target}"`);
      console.log(
        `[LAMBDA SIMULERING] Status: ${
          lambdaResponse.success ? "Lyckades" : "Misslyckades"
        }`
      );
      console.log(`[LAMBDA SIMULERING] Meddelande: ${lambdaResponse.message}`);
      break;

    case "notify_human":
      lambdaResponse = await invokeLambda(lambdaPayload);
      console.log(
        `[LAMBDA SIMULERING] Åtgärd: Notifierar mänsklig operatör för "${target}"`
      );
      console.log(
        `[LAMBDA SIMULERING] Status: ${
          lambdaResponse.success ? "Lyckades" : "Misslyckades"
        }`
      );
      console.log(`[LAMBDA SIMULERING] Meddelande: ${lambdaResponse.message}`);
      break;

    default:
      return {
        success: false,
        message: `Unknown action: ${action}`,
      };
  }

  if (assignedTo === "AI Assistant") {
    lambdaResponse = await invokeLambda(lambdaPayload);
    console.log(
      `[AI ASSISTANT] Utför automatisk åtgärd: ${action} på ${target}`
    );
    console.log(`[AI ASSISTANT] Rekommendation: ${recommendation}`);
    console.log(
      `[AI ASSISTANT] Lambda-resultat: ${
        lambdaResponse.success ? "Lyckades" : "Misslyckades"
      }`
    );

    if (lambdaResponse) {
      await sendAIActionNotification(incident, lambdaResponse);
    }
  }

  return {
    action: action,
    success: lambdaResponse?.success || false,
    message: `Auto fix executed: ${recommendation || "No action taken"}`,
    lambdaResponse: lambdaResponse,
  };
}
