// ============================================
// APP - Root component
// ============================================

import { useState, useEffect } from 'react';
import StatusMessages from './components/StatusMessages';
import { StatusMessage } from './types/StatusMessage';
import { Incident } from './types/Incident';
import { fetchIncidents } from './services/incidentService';
import { convertIncidentsToStatusMessages } from './utils/incidentMapper';
import { mockIncidents } from './utils/mockIncidents';

function App() {
  const [messages, setMessages] = useState<StatusMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(true);
      setUsingFallback(false);
      
      try {
        // Fetch incidents from backend
        const incidents: Incident[] = await fetchIncidents();
        
        // Convert incidents to status messages
        const statusMessages = convertIncidentsToStatusMessages(incidents);
        
        setMessages(statusMessages);
        setLoading(false);
      } catch (err) {
        console.warn('Backend not available, using mock data:', err);
        
        // Fallback: use mock data when backend doesn't respond
        const statusMessages = convertIncidentsToStatusMessages(mockIncidents);
        setMessages(statusMessages);
        setUsingFallback(true);
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading status messages...</p>
      </div>
    );
  }

  return (
    <>
      {usingFallback && (
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            color: '#856404',
            padding: '12px 20px',
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          ⚠️ Using mock data (backend not available)
        </div>
      )}
      <StatusMessages messages={messages} />
    </>
  );
}

export default App;
