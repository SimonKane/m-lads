import * as z from "zod";

export const IncidentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["open", "investigating", "resolved", "closed"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  createdAt: z.date(),
  aiAnalysis: z
    .object({
      type: z.string(),
      action: z.enum([
        "restart_service",
        "scale_up",
        "clear_cache",
        "notify_human",
        "none",
      ]),
      target: z.string().nullable(),
      priority: z.string(),
      recommendation: z.string(),
    })
    .optional(),
});