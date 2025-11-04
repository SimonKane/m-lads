// ============================================
// STATUS MESSAGES - Component for status messages
// ============================================

import { useState } from "react";
import { StatusMessage, StatusPriority, AIStatus } from "../types/StatusMessage";
import "./statusMessages.css";

interface StatusMessagesProps {
  messages: StatusMessage[];
}

type FilterType = "all" | "critical" | "high" | "medium" | "low";

const StatusMessages = ({ messages }: StatusMessagesProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
  
  const getPriorityColor = (priority: StatusPriority) => {
    switch (priority) {
      case "critical":
        return "critical";
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "ok";
      default:
        return "default";
    }
  };

  const getPriorityLabel = (priority: StatusPriority) => {
    switch (priority) {
      case "critical":
        return "Critical";
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return priority;
    }
  };

  const getTypeLabel = (type: StatusMessage["type"]) => {
    switch (type) {
      case "server_down":
        return "Server Down";
      case "high_cpu":
        return "High CPU";
      case "memory_leak":
        return "Memory Leak";
      case "network_issue":
        return "Network Issue";
      case "unknown":
        return "Unknown";
      default:
        return type;
    }
  };

  const getActionLabel = (action: StatusMessage["action"]) => {
    switch (action) {
      case "restart_service":
        return "Restart Service";
      case "scale_up":
        return "Scale Up";
      case "clear_cache":
        return "Clear Cache";
      case "notify_human":
        return "Notify Human";
      case "none":
        return "No Action";
      default:
        return action;
    }
  };

  const getAIStatusLabel = (aiStatus: AIStatus) => {
    switch (aiStatus) {
      case "assigned":
        return "AI Assigned";
      case "resolved":
        return "AI Resolved";
      default:
        return null;
    }
  };

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((msg) => msg.priority === filter);

  return (
    <div className="statusMsg-container">
      <h1 className="status-heading">Status Messages</h1>

      <div className="filter-menu">
        <button
          onClick={() => setFilter("all")}
          className={`filter-button ${filter === "all" ? "active" : ""}`}
        >
          All ({messages.length})
        </button>

        <button
          onClick={() => setFilter("critical")}
          className={`filter-button ${filter === "critical" ? "active critical" : ""}`}
        >
          Critical ({messages.filter((m) => m.priority === "critical").length})
        </button>

        <button
          onClick={() => setFilter("high")}
          className={`filter-button ${filter === "high" ? "active danger" : ""}`}
        >
          High ({messages.filter((m) => m.priority === "high").length})
        </button>

        <button
          onClick={() => setFilter("medium")}
          className={`filter-button ${filter === "medium" ? "active warning" : ""}`}
        >
          Medium ({messages.filter((m) => m.priority === "medium").length})
        </button>

        <button
          onClick={() => setFilter("low")}
          className={`filter-button ${filter === "low" ? "active ok" : ""}`}
        >
          Low ({messages.filter((m) => m.priority === "low").length})
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <p className="empty-message">
          {messages.length === 0
            ? "No status messages at the moment."
            : "No messages match the selected filter."}
        </p>
      ) : (
        <div className="message-list">
          {filteredMessages.map((msg, index) => (
            <div
              key={`${msg.title}-${index}`}
              className={`message-card ${getPriorityColor(msg.priority)}`}
            >
              <div className="message-header">
                <div>
                  <h2 className="message-title">{msg.title}</h2>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span className="message-type">{getTypeLabel(msg.type)}</span>
                    {msg.aiStatus && (
                      <span className={`ai-status-badge ${msg.aiStatus}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                          <path d="m440-120-40-120-120-40 120-40 40-120 40 120 120 40-120 40-40 120Zm300-200-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90ZM240-580l-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90Zm520 0-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90ZM440-40l40-120 120-40-120-40-40-120-40 120-120 40 120 40 40 120Zm300-200 30-90 90-30-90-30-30-90-30 90-90 30 90 30 30 90Z"/>
                        </svg>
                        {getAIStatusLabel(msg.aiStatus)}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`status-badge ${getPriorityColor(msg.priority)}`}>
                  {(msg.priority === "critical" || msg.priority === "high") ? (
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#FFFFFF">
                      <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#FFFFFF">
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                    </svg>
                  )}
                  {getPriorityLabel(msg.priority)}
                </span>
              </div>

              <p className="message-content">{msg.description}</p>

              <div className="message-details">
                {msg.assignedUser && !msg.aiStatus && (
                  <div className="detail-row assigned-user">
                    <strong>Assigned to:</strong>
                    <span className="user-badge">
                      <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-240q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm480 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Zm40 240v-112q0-19-9-36t-23-29q-10-5-22-9t-26-4q-38 0-73 9t-67 26q-11 8-22.5 13.5T519-300q-11 0-22.5-5.5T474-319q-28-17-59-26t-65-9q-66 0-123.5 25T161-238q-6 4-8.5 11t-2.5 14v112h640Z"/>
                      </svg>
                      {msg.assignedUser.name}
                      <span className="user-specialization">({msg.assignedUser.specialization})</span>
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <strong>Action:</strong> {getActionLabel(msg.action)}
                  {msg.target && <span className="target"> → {msg.target}</span>}
                </div>
                {msg.recommendation && (
                  <div className="detail-row recommendation">
                    <strong>Recommendation:</strong> {msg.recommendation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusMessages;
