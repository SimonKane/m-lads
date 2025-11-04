// ============================================
// INCIDENT SERVICE - API calls for incidents
// ============================================

import { Incident } from '../types/Incident';

const API_BASE_URL = '/api';

/**
 * Fetches all incidents from backend with timeout
 */
export async function fetchIncidents(): Promise<Incident[]> {
  const timeout = 3000; // 3 seconds timeout
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}/incidents`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // If it's an abort (timeout), throw a clear error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - backend not responding');
    }
    
    console.error('Error fetching incidents:', error);
    throw error;
  }
}

/**
 * Fetches a specific incident
 */
export async function fetchIncidentById(id: string): Promise<Incident> {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching incident ${id}:`, error);
    throw error;
  }
}
