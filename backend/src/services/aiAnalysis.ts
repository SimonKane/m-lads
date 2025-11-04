import "dotenv/config";
import OpenAI from "openai";
import { Incident } from "../models/incidentModel";

type AnalysisResult = NonNullable<Incident["aiAnalysis"]>;

console.log("API Key loaded:", process.env.API_KEY ? "✓ Yes" : "✗ No");

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Incident Manager",
  },
});

// Normalisera rådata från monitoring-system till Incident-format
export async function normalizeRawData(rawData: any): Promise<Incident> {
  const prompt = `Du är en AI som normaliserar övervakningsdata till ett strukturerat incident-format.

Läs följande rådata och skapa en incident-beskrivning på svenska.

Svara ENDAST med ett JSON-objekt i detta format (ingen annan text):
{
  "title": "Kort, beskrivande titel på svenska (max 10 ord)",
  "description": "Detaljerad beskrivning som sammanfattar problemet, inkludera relevant info från logs och metrics",
  "status": "open",
  "priority": "critical" | "high" | "medium" | "low"
}

Rådata:
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
      throw new Error("Ingen respons från AI");
    }

    const normalized = JSON.parse(responseText);

    // Skapa ett komplett Incident-objekt
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
    console.error("Fel vid normalisering:", error);
    // Fallback
    return {
      id: `incident-${Date.now()}`,
      title: "Okänd incident",
      description: `Rådata kunde inte normaliseras: ${JSON.stringify(
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
): Promise<AnalysisResult> {
  const prompt = `Du är en AI som analyserar IT-incidenter.
Läs texten nedan och klassificera incidenten enligt följande regler:

- Om det handlar om "down", "crashed" → type: "server_down", priority: "critical", action: "restart_service"
- Om det handlar om "cpu", "slow" → type: "high_cpu", priority: "high", action: "scale_up"
- Om det handlar om "memory", "leak" → type: "memory_leak", priority: "high", action: "clear_cache"
- Annars → type: "unknown", priority: "medium", action: "notify_human"

Svara ENDAST med ett JSON-objekt i detta format (ingen annan text):
{
  "type": "server_down" | "high_cpu" | "memory_leak" | "unknown",
  "priority": "critical" | "high" | "medium" | "low",
  "action": "restart_service" | "scale_up" | "clear_cache" | "notify_human" | "none",
  "target": "Namnet på den drabbade tjänsten/servern eller null",
  "recommendation": "En kort svensk mening om vad som bör göras"
}

Incident:
Titel: ${incident.title}
Beskrivning: ${incident.description}`;

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
      throw new Error("Ingen respons från AI");
    }

    const result = JSON.parse(responseText) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Fel vid AI-analys:", error);
    // Fallback vid fel
    return {
      type: "unknown",
      priority: "medium",
      action: "notify_human",
      target: null,
      recommendation:
        "Kunde inte analysera incidenten. Manuell granskning krävs.",
    };
  }
}

// Test funktionen (ta bort denna sektion när du är klar med testningen)
if (require.main === module) {
  console.log("🧪 Testar hela flödet: Normalisering + Analys...\n");

  (async () => {
    // Exempel på rådata från monitoring-system
    const rawData = {
      timestamp: "2024-11-04T14:23:45.123Z",
      source: "cloudwatch",
      severity: "ERROR",
      service: "payment-api",
      instance: "i-0abc123def456",
      region: "eu-north-1",
      metric: {
        name: "CPUUtilization",
        value: 98.5,
        threshold: 80,
      },
      logs: [
        "ERROR: OutOfMemoryException in PaymentProcessor.java:142",
        "ERROR: Connection pool exhausted - 0/50 available",
        "WARN: Response time degraded: 5.2s (normal: 0.3s)",
      ],
      tags: {
        environment: "production",
        team: "payments",
        priority: "high",
      },
    };

    console.log("📥 Steg 1: Normalisera rådata...\n");
    const incident = await normalizeRawData(rawData);

    console.log("✅ Normaliserad incident:");
    console.log(`  ID: ${incident.id}`);
    console.log(`  Titel: ${incident.title}`);
    console.log(`  Beskrivning: ${incident.description}`);
    console.log(`  Status: ${incident.status}`);
    console.log(`  Prioritet: ${incident.priority}\n`);

    console.log("🔍 Steg 2: Analysera incident...\n");
    const analysis = await analyzeIncident(incident);

    console.log("✅ Analysresultat:");
    console.log(`  Type: ${analysis.type}`);
    console.log(`  Priority: ${analysis.priority}`);
    console.log(`  Recommendation: ${analysis.recommendation}\n`);
  })();
}

// Default export för bakåtkompatibilitet
export default analyzeIncident;
