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
 * Converts an Incident to a StatusMessage
 */
export function convertIncidentToStatusMessage(incident: Incident): StatusMessage {
  const aiAnalysis = incident.aiAnalysis;
  
  return {
    title: incident.title,
    description: incident.description,
    type: aiAnalysis ? mapAiTypeToStatusType(aiAnalysis.type) : 'unknown',
    priority: incident.priority,
    action: aiAnalysis?.action || 'none',
    target: aiAnalysis?.target || null,
    recommendation: aiAnalysis?.recommendation || '',
    assignedUser: incident.assignedUser || null,
    aiStatus: incident.aiStatus || null,
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
