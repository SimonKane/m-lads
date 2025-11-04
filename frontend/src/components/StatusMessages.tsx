// ============================================
// STATUS MESSAGES - Komponent för statusmeddelanden
// ============================================

import { useState } from "react";
import { StatusMessage } from "../types/StatusMessage";

interface StatusMessagesProps {
  messages: StatusMessage[];
}

type FilterType = "all" | "critical" | "danger" | "ok";

const StatusMessages = ({ messages }: StatusMessagesProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const getStatusColor = (status: StatusMessage["status"]) => {
    switch (status) {
      case "critical":
        return "#dc3545"; // Röd
      case "danger":
        return "#ffc107"; // Gul
      case "ok":
        return "#28a745"; // Grön
      default:
        return "#6c757d"; // Grå
    }
  };

  const getStatusLabel = (status: StatusMessage["status"]) => {
    switch (status) {
      case "critical":
        return "Kritisk";
      case "danger":
        return "Varning";
      case "ok":
        return "OK";
      default:
        return status;
    }
  };

  // Filtrera meddelanden baserat på vald status
  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((msg) => msg.status === filter);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>Statusmeddelanden</h1>

      {/* Filtreringsmeny */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: filter === "all" ? "2px solid #007bff" : "2px solid #ddd",
            backgroundColor: filter === "all" ? "#007bff" : "#fff",
            color: filter === "all" ? "#fff" : "#333",
            fontWeight: filter === "all" ? "bold" : "normal",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Alla ({messages.length})
        </button>

        <button
          onClick={() => setFilter("critical")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border:
              filter === "critical" ? "2px solid #dc3545" : "2px solid #ddd",
            backgroundColor: filter === "critical" ? "#dc3545" : "#fff",
            color: filter === "critical" ? "#fff" : "#333",
            fontWeight: filter === "critical" ? "bold" : "normal",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Kritisk ({messages.filter((m) => m.status === "critical").length})
        </button>

        <button
          onClick={() => setFilter("danger")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border:
              filter === "danger" ? "2px solid #ffc107" : "2px solid #ddd",
            backgroundColor: filter === "danger" ? "#ffc107" : "#fff",
            color: filter === "danger" ? "#fff" : "#333",
            fontWeight: filter === "danger" ? "bold" : "normal",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Varning ({messages.filter((m) => m.status === "danger").length})
        </button>

        <button
          onClick={() => setFilter("ok")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: filter === "ok" ? "2px solid #28a745" : "2px solid #ddd",
            backgroundColor: filter === "ok" ? "#28a745" : "#fff",
            color: filter === "ok" ? "#fff" : "#333",
            fontWeight: filter === "ok" ? "bold" : "normal",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          OK ({messages.filter((m) => m.status === "ok").length})
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <p style={{ color: "#666", textAlign: "center", padding: "40px" }}>
          {messages.length === 0
            ? "Inga statusmeddelanden för tillfället."
            : "Inga meddelanden matchar det valda filtret."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                border: `2px solid ${getStatusColor(msg.status)}`,
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <h2 style={{ margin: 0, color: "#333", fontSize: "18px" }}>
                  {msg.title}
                </h2>
                <span
                  style={{
                    backgroundColor: getStatusColor(msg.status),
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {getStatusLabel(msg.status)}
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#666",
                  lineHeight: "1.5",
                }}
              >
                {msg.message}
              </p>

              <span style={{ fontSize: "12px", color: "#999" }}>
                {new Date(msg.timestamp).toLocaleString("sv-SE")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusMessages;
