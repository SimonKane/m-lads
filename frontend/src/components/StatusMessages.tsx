// ============================================
// STATUS MESSAGES - Komponent för statusmeddelanden
// ============================================

import { StatusMessage } from '../types/StatusMessage';

interface StatusMessagesProps {
  messages: StatusMessage[];
}

const StatusMessages = ({ messages }: StatusMessagesProps) => {
  const getStatusColor = (status: StatusMessage['status']) => {
    switch (status) {
      case 'critical':
        return '#dc3545'; // Röd
      case 'danger':
        return '#ffc107'; // Gul
      case 'ok':
        return '#28a745'; // Grön
      default:
        return '#6c757d'; // Grå
    }
  };

  const getStatusLabel = (status: StatusMessage['status']) => {
    switch (status) {
      case 'critical':
        return 'Kritisk';
      case 'danger':
        return 'Varning';
      case 'ok':
        return 'OK';
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Statusmeddelanden</h1>
      
      {messages.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
          Inga statusmeddelanden för tillfället.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                border: `2px solid ${getStatusColor(msg.status)}`,
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, color: '#333', fontSize: '18px' }}>{msg.title}</h2>
                <span
                  style={{
                    backgroundColor: getStatusColor(msg.status),
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  {getStatusLabel(msg.status)}
                </span>
              </div>
              
              <p style={{ margin: '0 0 8px 0', color: '#666', lineHeight: '1.5' }}>
                {msg.message}
              </p>
              
              <span style={{ fontSize: '12px', color: '#999' }}>
                {new Date(msg.timestamp).toLocaleString('sv-SE')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusMessages;

