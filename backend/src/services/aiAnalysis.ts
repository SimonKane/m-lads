interface Incident {
  id: string;
  title: string;
  description: string;
  status: "open" | "investigating" | "resolved" | "closed";
  priority: "critical" | "high" | "medium" | "low";
  createdAt: string;
  aiAnalysis?: { type: string; priority: string; recommendation: string };
}

interface AnalysisResult {
  type: string;
  priority: string;
  recommendation: string;
}

export default function analyzeIncident(
  incidents: Incident[]
): AnalysisResult[] {
  return incidents.map((incident) => {
    const text = `${incident.title} ${incident.description}`.toLowerCase();

    // Keyword matching
    if (text.includes("down") || text.includes("crashed")) {
      return {
        type: "server_down",
        priority: "critical",
        recommendation:
          "Omedelbar åtgärd krävs. Kontrollera serverstatus och starta om vid behov.",
      };
    }

    if (text.includes("cpu") || text.includes("slow")) {
      return {
        type: "high_cpu",
        priority: "high",
        recommendation:
          "Undersök processer med hög CPU-användning och optimera eller skala upp resurser.",
      };
    }

    if (text.includes("memory") || text.includes("leak")) {
      return {
        type: "memory_leak",
        priority: "high",
        recommendation:
          "Analysera minnesanvändning och identifiera potentiella minnesläckor i applikationen.",
      };
    }

    // Default case if no keywords match
    return {
      type: "unknown",
      priority: "medium",
      recommendation:
        "Incidenten kräver manuell granskning för korrekt klassificering.",
    };
  });
}
