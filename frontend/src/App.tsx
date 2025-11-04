// ============================================
// APP - Root-komponent
// ============================================

import { useState, useEffect } from 'react';
import StatusMessages from './components/StatusMessages';
import { StatusMessage } from './types/StatusMessage';

function App() {
  const [messages, setMessages] = useState<StatusMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulerad data för statusmeddelanden
    // I en verklig applikation skulle detta hämtas från en API
    const mockMessages: StatusMessage[] = [
      {
        id: '1',
        title: 'Systemfel upptäckt',
        message: 'Ett kritiskt systemfel har upptäckts i produktionsmiljön. Omedelbar åtgärd krävs.',
        status: 'critical',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Hög belastning på servern',
        message: 'Servern upplever en hög belastning. Övervaka systemet noga.',
        status: 'danger',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        title: 'Alla system fungerar normalt',
        message: 'Alla system är igång och fungerar som förväntat. Inga problem rapporterade.',
        status: 'ok',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '4',
        title: 'Säkerhetsvarning',
        message: 'Misstänkt aktivitet upptäckt i systemet. Undersökning pågår.',
        status: 'danger',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: '5',
        title: 'Backup lyckades',
        message: 'Daglig backup har slutförts utan problem.',
        status: 'ok',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Simulera API-anrop
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Laddar statusmeddelanden...</p>
      </div>
    );
  }

  return <StatusMessages messages={messages} />;
}

export default App;
