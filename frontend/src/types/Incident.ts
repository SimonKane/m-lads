// ============================================
// INCIDENT TYPE - TypeScript interface
// ============================================

// SYFTE:
// Denna fil definierar TypeScript-typen för en incident.
// Detta säkerställer att frontend och backend använder samma datastruktur.

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string; // Datum från API kommer som string
  aiAnalysis?: {
    type: string;
    action:
      | 'restart_service'
      | 'scale_up'
      | 'clear_cache'
      | 'notify_human'
      | 'none';
    target: string | null;
    priority: string;
    recommendation: string;
  };
  assignedUser?: {
    id: string;
    name: string;
    specialization: string;
  } | null;
  aiStatus?: 'assigned' | 'resolved' | null;
}
