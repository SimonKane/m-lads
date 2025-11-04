// ============================================
// INCIDENT MAPPER - Converts Incident to StatusMessage
// ============================================

import { Incident } from '../types/Incident';
import { StatusMessage, StatusType } from '../types/StatusMessage';

/**
 * Maps aiAnalysis.type to StatusMessage type
 */
function mapAiTypeToStatusType(aiType: string): StatusType {
  const lowerType = aiType.toLowerCase();
  
  if (lowerType.includes('server') || lowerType.includes('down')) {
    return 'server_down';
  }
  if (lowerType.includes('cpu') || lowerType.includes('performance')) {
    return 'high_cpu';
  }
  if (lowerType.includes('memory') || lowerType.includes('cache')) {
    return 'memory_leak';
  }
  if (lowerType.includes('network') || lowerType.includes('api')) {
    return 'network_issue';
  }
  
  return 'unknown';
}

/**
 * Determines AI status based on assignedTo and incident status
 */
function determineAIStatus(assignedTo: string | null | undefined, status: Incident['status']): 'assigned' | 'resolved' | null {
  // If status is resolved or closed, AI has resolved it
  if (status === 'resolved' || status === 'closed') {
    // If it was assigned to AI, mark as resolved
    if (assignedTo && assignedTo.toLowerCase().includes('ai')) {
      return 'resolved';
    }
  }
  // If assignedTo exists and contains AI, mark as assigned
  if (assignedTo && assignedTo.toLowerCase().includes('ai')) {
    return 'assigned';
  }
  return null;
}

/**
 * Converts an Incident to a StatusMessage
 */
export function convertIncidentToStatusMessage(incident: Incident): StatusMessage {
  const aiAnalysis = incident.aiAnalysis;
  const assignedTo = aiAnalysis?.assignedTo || null;
  const aiStatus = determineAIStatus(assignedTo, incident.status);
  
  return {
    title: incident.title,
    description: incident.description,
    type: aiAnalysis ? mapAiTypeToStatusType(aiAnalysis.type) : 'unknown',
    priority: incident.priority,
    action: aiAnalysis?.action || 'none',
    target: aiAnalysis?.target || null,
    recommendation: aiAnalysis?.recommendation || '',
    assignedTo: assignedTo,
    aiStatus: aiStatus,
    status: incident.status,
    createdAt: incident.createdAt,
  };
}

/**
 * Converts an array of Incidents to StatusMessages
 */
export function convertIncidentsToStatusMessages(
  incidents: Incident[]
): StatusMessage[] {
  return incidents.map(convertIncidentToStatusMessage);
}
