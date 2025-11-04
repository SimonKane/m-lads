// ============================================
// STATUS MESSAGE TYPE - TypeScript interface
// ============================================

export type StatusType = 'server_down' | 'high_cpu' | 'memory_leak' | 'network_issue' | 'unknown';
export type StatusPriority = 'critical' | 'high' | 'medium' | 'low';
export type StatusAction = 'restart_service' | 'scale_up' | 'clear_cache' | 'notify_human' | 'none';
export type AIStatus = 'assigned' | 'resolved' | null;
export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'closed';

export interface StatusMessage {
  title: string;
  description: string;
  type: StatusType;
  priority: StatusPriority;
  action: StatusAction;
  target: string | null;
  recommendation: string;
  assignedUser: {
    id: string;
    name: string;
    specialization: string;
  } | null;
  aiStatus: AIStatus;
  status: ReportStatus;
}
