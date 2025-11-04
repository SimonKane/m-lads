// ============================================
// MOCK INCIDENTS - Fallback data for development
// ============================================

import { Incident } from '../types/Incident';

/**
 * Mock incidents based on backend structure
 * Used as fallback when backend doesn't respond
 */
export const mockIncidents: Incident[] = [
  {
    id: 'incident-1',
    title: 'Database Connection Timeout',
    description:
      'Production database experiencing intermittent connection timeouts affecting user queries',
    status: 'investigating',
    priority: 'critical',
    createdAt: new Date('2025-01-04T08:30:00').toISOString(),
    aiAnalysis: {
      type: 'Database Performance',
      action: 'scale_up',
      target: 'database',
      priority: 'critical',
      recommendation:
        'Check connection pool settings and database server load. Consider scaling resources.',
      assignedTo: 'AI Assistant',
    },
  },
  {
    id: 'incident-2',
    title: 'API Rate Limit Exceeded',
    description:
      'Third-party API returning 429 errors due to rate limit being exceeded',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2025-01-04T09:15:00').toISOString(),
    aiAnalysis: {
      type: 'API Integration',
      action: 'notify_human',
      target: null,
      priority: 'high',
      recommendation:
        'Implement request throttling and caching strategy for API calls.',
      assignedTo: null,
    },
  },
  {
    id: 'incident-3',
    title: 'Cache Server Memory Spike',
    description: 'Redis cache server showing unusually high memory usage',
    status: 'resolved',
    priority: 'medium',
    createdAt: new Date('2025-01-03T14:20:00').toISOString(),
    aiAnalysis: {
      type: 'Cache Performance',
      action: 'clear_cache',
      target: 'cache',
      priority: 'medium',
      recommendation:
        'Clear cache and monitor memory usage. Consider implementing cache eviction policies.',
      assignedTo: 'AI Assistant',
    },
  },
  {
    id: 'incident-4',
    title: 'SSL Certificate Expiring Soon',
    description: 'SSL certificate for main domain expires in 7 days',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2025-01-04T07:00:00').toISOString(),
    aiAnalysis: {
      type: 'Security',
      action: 'notify_human',
      target: null,
      priority: 'high',
      recommendation:
        'Renew SSL certificate immediately to prevent service disruption.',
      assignedTo: null,
    },
  },
  {
    id: 'incident-5',
    title: 'Minor UI Bug in Dashboard',
    description: 'Alignment issue in the reporting dashboard on mobile devices',
    status: 'closed',
    priority: 'low',
    createdAt: new Date('2025-01-02T11:45:00').toISOString(),
    aiAnalysis: {
      type: 'Frontend',
      action: 'none',
      target: null,
      priority: 'low',
      recommendation:
        'CSS media query adjustment needed for responsive design.',
      assignedTo: 'AI Assistant',
    },
  },
];
