// ============================================
// INCIDENT TYPE - TypeScript interface
// ============================================

// SYFTE:
// Denna fil definierar TypeScript-typen för en incident.
// Detta säkerställer att frontend och backend använder samma datastruktur.

// UPPGIFT:
// Skapa ett interface som matchar backend:
// - id: string
// - title: string
// - description: string
// - status: 'open' | 'investigating' | 'resolved' | 'closed'
// - priority: 'critical' | 'high' | 'medium' | 'low'
// - createdAt: string (datum från API kommer som string)
// - aiAnalysis?: { type: string, priority: string, recommendation: string }

// Tips: Exportera interface så den kan användas i alla komponenter
// Tips: Använd optional (?) för fält som kanske inte alltid finns
