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
      // Handle 404 case (no incidents found)
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Backend returns { data: incidents[] } or { message: "..." }
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    // Fallback: if response is directly an array
    if (Array.isArray(result)) {
      return result;
    }
    
    // If no data found, return empty array
    return [];
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
    const response = await fetch(`${API_BASE_URL}/incidents/${id}/`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Incident ${id} not found`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Backend returns { incident: ... } or { data: ... }
    if (result.incident) {
      return result.incident;
    }
    if (result.data) {
      return result.data;
    }
    
    // Fallback: if response is directly the incident
    return result;
  } catch (error) {
    console.error(`Error fetching incident ${id}:`, error);
    throw error;
  }
}

export async function getIncidents(): Promise<any[]> {
    const res = await fetch('http://localhost:3000/incidents', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to fetch incidents: ${res.status} ${body}`);
    }
    return res.json();
}

export async function createIncident(description: string): Promise<any> {
    const res = await fetch('http://localhost:3000/incidents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ description })
    });

    const text = await res.text();
    let parsed: any;
    try { parsed = JSON.parse(text); } catch { parsed = text; }

    if (!res.ok) {
        throw { status: res.status, body: parsed };
    }
    return parsed;
}
