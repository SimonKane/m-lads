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
    target: string | null
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

// In-Memory Storage - Incidents
export const incidentArray: Incident[] = [
  {
    id: "incident-1",
    title: "Database Connection Timeout",
    description:
      "Production database experiencing intermittent connection timeouts affecting user queries",
    status: "investigating",
    priority: "critical",
    createdAt: new Date("2025-01-04T08:30:00"),
    aiAnalysis: {
      type: "Database Performance",
      action: "scale_up",
      target: null,
      priority: "critical",
      recommendation:
        "Check connection pool settings and database server load. Consider scaling resources.",
    },
  },
  {
    id: "incident-2",
    title: "API Rate Limit Exceeded",
    description:
      "Third-party API returning 429 errors due to rate limit being exceeded",
    status: "open",
    priority: "high",
    createdAt: new Date("2025-01-04T09:15:00"),
    aiAnalysis: {
      type: "API Integration",
      action: "notify_human",
      target: null,
      priority: "high",
      recommendation:
        "Implement request throttling and caching strategy for API calls.",
    },
  },
  {
    id: "incident-3",
    title: "Cache Server Memory Spike",
    description: "Redis cache server showing unusually high memory usage",
    status: "resolved",
    priority: "medium",
    createdAt: new Date("2025-01-03T14:20:00"),
    aiAnalysis: {
      type: "Cache Performance",
      action: "clear_cache",
      target: null,
      priority: "medium",
      recommendation:
        "Clear cache and monitor memory usage. Consider implementing cache eviction policies.",
    },
  },
  {
    id: "incident-4",
    title: "SSL Certificate Expiring Soon",
    description: "SSL certificate for main domain expires in 7 days",
    status: "open",
    priority: "high",
    createdAt: new Date("2025-01-04T07:00:00"),
    aiAnalysis: {
      type: "Security",
      action: "notify_human",
      target: null,
      priority: "high",
      recommendation:
        "Renew SSL certificate immediately to prevent service disruption.",
    },
  },
  {
    id: "incident-5",
    title: "Minor UI Bug in Dashboard",
    description: "Alignment issue in the reporting dashboard on mobile devices",
    status: "closed",
    priority: "low",
    createdAt: new Date("2025-01-02T11:45:00"),
    aiAnalysis: {
      type: "Frontend",
      action: "none",
      target: null,
      priority: "low",
      recommendation:
        "CSS media query adjustment needed for responsive design.",
    },
  },
]
