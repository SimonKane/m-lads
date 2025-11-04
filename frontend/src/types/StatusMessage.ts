// ============================================
// STATUS MESSAGE TYPE - TypeScript interface
// ============================================

export type StatusType = 'critical' | 'danger' | 'ok';

export interface StatusMessage {
  id: string;
  title: string;
  message: string;
  status: StatusType;
  timestamp: string;
}

