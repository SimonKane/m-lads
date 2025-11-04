// ============================================
// STATUS MESSAGES - Component for status messages
// ============================================

import { useState } from "react";
import { StatusMessage, StatusPriority, AIStatus, ReportStatus } from "../types/StatusMessage";
import "./statusMessages.css";

interface StatusMessagesProps {
  messages: StatusMessage[];
}

type FilterType = "all" | "critical" | "high" | "medium" | "low";
type SortType = "priority-desc" | "priority-asc" | "alphabetical-asc" | "alphabetical-desc" | "type-asc";

const StatusMessages = ({ messages }: StatusMessagesProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("priority-desc");
  
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

  const getReportStatusLabel = (status: ReportStatus) => {
    switch (status) {
      case "open":
        return "Open";
      case "investigating":
        return "Investigating";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const getReportStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "open":
        return "status-open";
      case "investigating":
        return "status-investigating";
      case "resolved":
        return "status-resolved";
      case "closed":
        return "status-closed";
      default:
        return "status-default";
    }
  };

  const getPriorityOrder = (priority: StatusPriority): number => {
    switch (priority) {
      case "critical":
        return 0;
      case "high":
        return 1;
      case "medium":
        return 2;
      case "low":
        return 3;
      default:
        return 4;
    }
  };

  const sortMessages = (msgs: StatusMessage[]): StatusMessage[] => {
    const sorted = [...msgs];
    
    switch (sort) {
      case "priority-desc":
        return sorted.sort((a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority));
      case "priority-asc":
        return sorted.sort((a, b) => getPriorityOrder(b.priority) - getPriorityOrder(a.priority));
      case "alphabetical-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "alphabetical-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "type-asc":
        return sorted.sort((a, b) => getTypeLabel(a.type).localeCompare(getTypeLabel(b.type)));
      default:
        return sorted;
    }
  };

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((msg) => msg.priority === filter);
  
  const sortedAndFilteredMessages = sortMessages(filteredMessages);

  return (
    <div className="statusMsg-container">
      <div className="header-controls">
        <h1 className="status-heading">Status Messages</h1>
        
        <div className="sort-controls">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="sort-select"
          >
            <option value="priority-desc">Priority: Critical → Low</option>
            <option value="priority-asc">Priority: Low → Critical</option>
            <option value="alphabetical-asc">Alphabetical: A-Z</option>
            <option value="alphabetical-desc">Alphabetical: Z-A</option>
            <option value="type-asc">Type: A-Z</option>
          </select>
        </div>
      </div>

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

      {sortedAndFilteredMessages.length === 0 ? (
        <p className="empty-message">
          {messages.length === 0
            ? "No status messages at the moment."
            : "No messages match the selected filter."}
        </p>
      ) : (
        <div className="message-list">
          {sortedAndFilteredMessages.map((msg, index) => (
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
                    <span className={`report-status-badge ${getReportStatusColor(msg.status)}`}>
                      {msg.status === 'resolved' || msg.status === 'closed' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                        </svg>
                      ) : msg.status === 'investigating' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                        </svg>
                      )}
                      {getReportStatusLabel(msg.status)}
                    </span>
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
                {msg.assignedTo && !msg.aiStatus && (
                  <div className="detail-row assigned-user">
                    <strong>Assigned to:</strong>
                    <span className="user-badge">
                      {msg.assignedTo}
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
