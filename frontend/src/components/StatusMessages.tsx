// ============================================
// STATUS MESSAGES - Komponent för statusmeddelanden
// ============================================

import { useState } from "react";
import { StatusMessage } from "../types/StatusMessage";
import "./statusMessages.css";

interface StatusMessagesProps {
  messages: StatusMessage[];
}

type FilterType = "all" | "critical" | "danger" | "ok";

const StatusMessages = ({ messages }: StatusMessagesProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
  
  const getStatusColor = (status: StatusMessage["status"]) => {
    switch (status) {
      case "critical":
        return "critical";
      case "danger":
        return "danger";
      case "ok":
        return "ok";
      default:
        return "default";
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

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((msg) => msg.status === filter);

  return (
    <div className="statusMsg-container">
      <h1 className="status-heading">Statusmeddelanden</h1>

      <div className="filter-menu">
        <button
          onClick={() => setFilter("all")}
          className={`filter-button ${filter === "all" ? "active" : ""}`}
        >
          Alla ({messages.length})
        </button>

        <button
          onClick={() => setFilter("critical")}
          className={`filter-button ${filter === "critical" ? "active critical" : ""}`}
        >
          Kritisk ({messages.filter((m) => m.status === "critical").length})
        </button>

        <button
          onClick={() => setFilter("danger")}
          className={`filter-button ${filter === "danger" ? "active danger" : ""}`}
        >
          Varning ({messages.filter((m) => m.status === "danger").length})
        </button>

        <button
          onClick={() => setFilter("ok")}
          className={`filter-button ${filter === "ok" ? "active ok" : ""}`}
        >
          OK ({messages.filter((m) => m.status === "ok").length})
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <p className="empty-message">
          {messages.length === 0
            ? "Inga statusmeddelanden för tillfället."
            : "Inga meddelanden matchar det valda filtret."}
        </p>
      ) : (
        <div className="message-list">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`message-card ${getStatusColor(msg.status)}`}
              
            >
              <div className="message-header">
                <h2 className="message-title">{msg.title}</h2>
                <span className={`status-badge ${getStatusColor(msg.status)}`}>
                  {(msg.status === "danger" || msg.status === "critical") ? <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#FFFFFF"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#FFFFFF"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>}
                  {getStatusLabel(msg.status)}
                </span>
              </div>

              <p className="message-content">{msg.message}</p>

              <span className="message-timestamp">
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
