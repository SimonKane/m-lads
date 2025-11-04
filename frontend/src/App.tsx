// ============================================
// APP - Root component
// ============================================

import { useState, useEffect } from "react";
import StatusMessages from "./components/StatusMessages";
import { StatusMessage } from "./types/StatusMessage";
import { Incident } from "./types/Incident";
import { fetchIncidents } from "./services/incidentService";
import { convertIncidentsToStatusMessages } from "./utils/incidentMapper";
import { mockIncidents } from "./utils/mockIncidents";
import ErrorTester from "./components/ErrorTester";

function App() {
  const [messages, setMessages] = useState<StatusMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
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
        console.warn("Backend not available, using mock data:", err);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 0 24 24"
              width="20px"
              fill="currentColor"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 0 24 24"
              width="20px"
              fill="currentColor"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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
      <ErrorTester onIncidentCreated={fetchIncidents} />
    </>
  );
}

export default App;
