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
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

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
      <div className="loading-container">
        <p>Loading status messages...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dark-mode-toggle">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="dark-mode-button"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T454-480q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-680q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T454-480q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-680q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
            </svg>
          )}
        </button>
      </div>
      {usingFallback && (
        <div className="fallback-warning">
          ⚠️ Using mock data (backend not available)
        </div>
      )}
      <StatusMessages messages={messages} />
    </>
  );
}

export default App;
