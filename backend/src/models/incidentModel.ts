// Incident Interface
export interface Incident {
  id: string
  title: string
  description: string
  status: "open" | "investigating" | "resolved" | "closed"
  priority: "critical" | "high" | "medium" | "low"
  createdAt: Date
  aiAnalysis?: {
    type: string
    action:
      | "restart_service"
      | "scale_up"
      | "clear_cache"
      | "notify_human"
      | "none"
    target: "database" | "api" | "cache" | "auth-service" | null
    priority: string
    recommendation: string
  }
}

// IT Staff Interface
export interface ITStaff {
  id: string
  name: string
  specialization: string
}

// In-Memory Storage - IT Staff
export const itStaff: ITStaff[] = [
  { id: "1", name: "Anna", specialization: "Database & Backend" },
  { id: "2", name: "Johan", specialization: "API & Performance" },
  { id: "3", name: "Lisa", specialization: "Cache & Infrastructure" },
  {
    id: "4",
    name: "AI Assistant",
    specialization: "General troubleshooting & unknown issues",
  },
];
