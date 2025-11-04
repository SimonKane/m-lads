// ============================================
// STATUS MESSAGES - Component for status messages
// ============================================

import { useState } from "react";
import {
  StatusMessage,
  StatusPriority,
  ReportStatus,
} from "../types/StatusMessage";
import "./statusMessages.css";

interface StatusMessagesProps {
  messages: StatusMessage[];
}

type PriorityFilterType = "all" | "critical" | "high" | "medium" | "low";
type StatusFilterType =
  | "all"
  | "open"
  | "investigating"
  | "resolved"
  | "closed";
type SortType =
  | "priority-desc"
  | "priority-asc"
  | "alphabetical-asc"
  | "alphabetical-desc"
  | "type-asc"
  | "time-desc"
  | "time-asc";

const StatusMessages = ({ messages }: StatusMessagesProps) => {
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [sort, setSort] = useState<SortType>("priority-desc");
  const [selectedMessage, setSelectedMessage] = useState<StatusMessage | null>(
    null
  );

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

  const formatTimestamp = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        return "Just now";
      } else if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        // Format as date: "Jan 4, 2025"
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch (error) {
      return "Unknown";
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
        return sorted.sort(
          (a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
        );
      case "priority-asc":
        return sorted.sort(
          (a, b) => getPriorityOrder(b.priority) - getPriorityOrder(a.priority)
        );
      case "alphabetical-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "alphabetical-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "type-asc":
        return sorted.sort((a, b) =>
          getTypeLabel(a.type).localeCompare(getTypeLabel(b.type))
        );
      case "time-desc":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // Newest first
        });
      case "time-asc":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateA - dateB; // Oldest first
        });
      default:
        return sorted;
    }
  };

  // Beräkna tillgängliga alternativ baserat på valda filter
  // Om priority är vald, visa bara statusar som finns för den priorityn
  let availableForStatusFilter = messages;
  if (priorityFilter !== "all") {
    availableForStatusFilter = messages.filter(
      (msg) => msg.priority === priorityFilter
    );
  }

  // Om status är vald, visa bara prioriteringar som finns för den statusen
  let availableForPriorityFilter = messages;
  if (statusFilter !== "all") {
    availableForPriorityFilter = messages.filter(
      (msg) => msg.status === statusFilter
    );
  }

  // Hämta unika statusar från tillgängliga messages
  const availableStatuses = Array.from(
    new Set(availableForStatusFilter.map((msg) => msg.status))
  );

  // Hämta unika prioriteringar från tillgängliga messages
  const availablePriorities = Array.from(
    new Set(availableForPriorityFilter.map((msg) => msg.priority))
  );


  // Filtrera först efter prioritet, sedan efter status
  let filteredMessages = messages;

  if (priorityFilter !== "all") {
    filteredMessages = filteredMessages.filter(
      (msg) => msg.priority === priorityFilter
    );
  }

  if (statusFilter !== "all") {
    filteredMessages = filteredMessages.filter(
      (msg) => msg.status === statusFilter
    );
  }

  const sortedAndFilteredMessages = sortMessages(filteredMessages);

  return (
    <div className="statusMsg-container">
      <h1 className="status-heading">Status Messages</h1>

      {/* Filter and Sort Controls - All Dropdowns */}
      <div
        className="sort-controls"
        style={{
          display: "flex",
          gap: "32px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Priority Filter Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="priority-filter" className="sort-label">
            Filter by Priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => {
              const newPriority = e.target.value as PriorityFilterType;
              setPriorityFilter(newPriority);
              // Om den valda statusen inte finns för den nya priorityn, återställ status
              if (newPriority !== "all" && statusFilter !== "all") {
                const filteredByPriority = messages.filter(
                  (msg) => msg.priority === newPriority
                );
                const availableStatuses = Array.from(
                  new Set(filteredByPriority.map((msg) => msg.status))
                );
                if (!availableStatuses.includes(statusFilter)) {
                  setStatusFilter("all");
                }
              }
            }}
            className="sort-select"
          >
            <option value="all">All Priorities ({messages.length})</option>
            {availablePriorities.includes("critical") && (
              <option value="critical">
                Critical (
                {availableForPriorityFilter.filter((m) => m.priority === "critical").length})
              </option>
            )}
            {availablePriorities.includes("high") && (
              <option value="high">
                High ({availableForPriorityFilter.filter((m) => m.priority === "high").length})
              </option>
            )}
            {availablePriorities.includes("medium") && (
              <option value="medium">
                Medium ({availableForPriorityFilter.filter((m) => m.priority === "medium").length})
              </option>
            )}
            {availablePriorities.includes("low") && (
              <option value="low">
                Low ({availableForPriorityFilter.filter((m) => m.priority === "low").length})
              </option>
            )}
          </select>
        </div>

        {/* Status Filter Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="status-filter" className="sort-label">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              const newStatus = e.target.value as StatusFilterType;
              setStatusFilter(newStatus);
              // Om den valda priorityn inte finns för den nya statusen, återställ priority
              if (newStatus !== "all" && priorityFilter !== "all") {
                const filteredByStatus = messages.filter(
                  (msg) => msg.status === newStatus
                );
                const availablePriorities = Array.from(
                  new Set(filteredByStatus.map((msg) => msg.priority))
                );
                if (!availablePriorities.includes(priorityFilter)) {
                  setPriorityFilter("all");
                }
              }
            }}
            className="sort-select"
          >
            <option value="all">All Statuses ({messages.length})</option>
            {availableStatuses.includes("open") && (
              <option value="open">
                Open ({availableForStatusFilter.filter((m) => m.status === "open").length})
              </option>
            )}
            {availableStatuses.includes("investigating") && (
              <option value="investigating">
                Investigating (
                {availableForStatusFilter.filter((m) => m.status === "investigating").length})
              </option>
            )}
            {availableStatuses.includes("resolved") && (
              <option value="resolved">
                Resolved ({availableForStatusFilter.filter((m) => m.status === "resolved").length}
                )
              </option>
            )}
            {availableStatuses.includes("closed") && (
              <option value="closed">
                Closed ({availableForStatusFilter.filter((m) => m.status === "closed").length})
              </option>
            )}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="sort-select" className="sort-label">
            Sort by
          </label>
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
            <option value="time-desc">Time: Newest First</option>
            <option value="time-asc">Time: Oldest First</option>
          </select>
        </div>
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
              onClick={() => setSelectedMessage(msg)}
              style={{ cursor: "pointer" }}
            >
              <div className="message-header">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <h2 className="message-title" style={{ flex: 1 }}>{msg.title}</h2>
                    <span className="timestamp" style={{ 
                      fontSize: "12px", 
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      marginTop: "4px"
                    }}>
                      {formatTimestamp(msg.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "4px",
                    }}
                  >
                    <span className="message-type">
                      {getTypeLabel(msg.type)}
                    </span>
                    <span
                      className={`report-status-badge ${getReportStatusColor(
                        msg.status
                      )}`}
                    >
                      {msg.status === "resolved" || msg.status === "closed" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="14px"
                          viewBox="0 -960 960 960"
                          width="14px"
                          fill="currentColor"
                        >
                          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg>
                      ) : msg.status === "investigating" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="14px"
                          viewBox="0 -960 960 960"
                          width="14px"
                          fill="currentColor"
                        >
                          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="14px"
                          viewBox="0 -960 960 960"
                          width="14px"
                          fill="currentColor"
                        >
                          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                        </svg>
                      )}
                      {getReportStatusLabel(msg.status)}
                    </span>
                  </div>
                </div>
                <span
                  className={`status-badge ${getPriorityColor(msg.priority)}`}
                >
                  {msg.priority === "critical" || msg.priority === "high" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#FFFFFF"
                    >
                      <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#FFFFFF"
                    >
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                  )}
                  {getPriorityLabel(msg.priority)}
                </span>
              </div>

              <p className="message-content">{msg.description}</p>

              <div className="message-details">
                {msg.assignedTo && (
                  <div className="detail-row assigned-user">
                    <strong>Assigned to:</strong>
                    <span
                      className={`user-badge ${
                        msg.aiStatus ? "ai-assigned" : ""
                      }`}
                    >
                      {msg.aiStatus && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="14px"
                          viewBox="0 -960 960 960"
                          width="14px"
                          fill="currentColor"
                          style={{ marginRight: "4px" }}
                        >
                          <path d="m440-120-40-120-120-40 120-40 40-120 40 120 120 40-120 40-40 120Zm300-200-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90ZM240-580l-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90Zm520 0-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90ZM440-40l40-120 120-40-120-40-40-120-40 120-120 40 120 40 40 120Zm300-200 30-90 90-30-90-30-30-90-30 90-90 30 90 30 30 90Z" />
                        </svg>
                      )}
                      {msg.assignedTo}
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <strong>Action:</strong> {getActionLabel(msg.action)}
                  {msg.target && (
                    <span className="target"> → {msg.target}</span>
                  )}
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

      {/* Modal */}
      {selectedMessage && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedMessage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            className={`modal-content message-card ${getPriorityColor(
              selectedMessage.priority
            )}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              margin: "0",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMessage(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#dc3545",
                border: "2px solid #fff",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#fff",
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#bb2d3b";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#dc3545";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ×
            </button>

            <div className="message-header" style={{ paddingRight: "60px", paddingTop: "8px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <h2 className="message-title" style={{ flex: 1 }}>{selectedMessage.title}</h2>
                  <span className="timestamp" style={{ 
                    fontSize: "12px", 
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    marginTop: "4px"
                  }}>
                    {formatTimestamp(selectedMessage.createdAt)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: "4px",
                  }}
                >
                  <span className="message-type">
                    {getTypeLabel(selectedMessage.type)}
                  </span>
                  <span
                    className={`report-status-badge ${getReportStatusColor(
                      selectedMessage.status
                    )}`}
                  >
                    {selectedMessage.status === "resolved" ||
                    selectedMessage.status === "closed" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="14px"
                        viewBox="0 -960 960 960"
                        width="14px"
                        fill="currentColor"
                      >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </svg>
                    ) : selectedMessage.status === "investigating" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="14px"
                        viewBox="0 -960 960 960"
                        width="14px"
                        fill="currentColor"
                      >
                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="14px"
                        viewBox="0 -960 960 960"
                        width="14px"
                        fill="currentColor"
                      >
                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                    )}
                    {getReportStatusLabel(selectedMessage.status)}
                  </span>
                </div>
              </div>
              <span
                className={`status-badge ${getPriorityColor(
                  selectedMessage.priority
                )}`}
              >
                {selectedMessage.priority === "critical" ||
                selectedMessage.priority === "high" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="#FFFFFF"
                  >
                    <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="#FFFFFF"
                  >
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </svg>
                )}
                {getPriorityLabel(selectedMessage.priority)}
              </span>
            </div>

            <p
              className="message-content"
              style={{ fontSize: "16px", lineHeight: "1.6" }}
            >
              {selectedMessage.description}
            </p>

            <div className="message-details">
              {selectedMessage.assignedTo && (
                <div className="detail-row assigned-user">
                  <strong>Assigned to:</strong>
                  <span
                    className={`user-badge ${
                      selectedMessage.aiStatus ? "ai-assigned" : ""
                    }`}
                  >
                    {selectedMessage.aiStatus && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="14px"
                        viewBox="0 -960 960 960"
                        width="14px"
                        fill="currentColor"
                        style={{ marginRight: "4px" }}
                      >
                        <path d="m440-120-40-120-120-40 120-40 40-120 40 120 120 40-120 40-40 120Zm300-200-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90ZM240-580l-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90Zm520 0-30-90-90-30 90-30 30-90 30 90 90 30-90 30-30 90ZM440-40l40-120 120-40-120-40-40-120-40 120-120 40 120 40 40 120Zm300-200 30-90 90-30-90-30-30-90-30 90-90 30 90 30 30 90Z" />
                      </svg>
                    )}
                    {selectedMessage.assignedTo}
                  </span>
                </div>
              )}
              <div className="detail-row">
                <strong>Action:</strong>{" "}
                {getActionLabel(selectedMessage.action)}
                {selectedMessage.target && (
                  <span className="target"> → {selectedMessage.target}</span>
                )}
              </div>
              {selectedMessage.recommendation && (
                <div className="detail-row recommendation">
                  <strong>Recommendation:</strong>{" "}
                  {selectedMessage.recommendation}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusMessages;
