import React, { useState } from 'react';
import { fetchRandomError } from '../services/errorService';
import { createIncident } from '../services/incidentService';

type Props = {
    onIncidentCreated?: () => void;
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
};

const modalStyle: React.CSSProperties = {
    background: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 700,               // set a maximum width
    minWidth: 320,              // ensure it's not too small on mobile
    boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
    maxHeight: '80vh',
    overflowY: 'auto',          // allow vertical scrolling inside the modal
    overflowX: 'hidden'         // prevent horizontal overflow
};

const bottomButtonStyle: React.CSSProperties = {
    position: 'fixed',
    right: 20,
    bottom: 20,
    zIndex: 10000,
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 6,
    cursor: 'pointer'
};

export default function ErrorTester({ onIncidentCreated }: Props): JSX.Element {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [sending, setSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState<string | null>(null);
    const [sendError, setSendError] = useState<any>(null);

    const callError = async () => {
        setLoading(true);
        setResult(null);
        setError(null);
        setSendSuccess(null);
        setSendError(null);
        try {
            const data = await fetchRandomError();
            setResult(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const openAndCall = () => {
        setOpen(true);
        callError();
    };

    const currentText = () => {
        if (result !== null && result !== undefined) {
            return typeof result === 'string' ? result : JSON.stringify(result);
        }
        if (error !== null && error !== undefined) {
            return typeof error === 'string' ? error : JSON.stringify(error);
        }
        return '';
    };

    const sendToIncidents = async () => {
        const description = currentText();
        if (!description) return;
        setSending(true);
        setSendSuccess(null);
        setSendError(null);
        try {
            await createIncident(description);
            setSendSuccess('Incident created');
            if (onIncidentCreated) onIncidentCreated();
        } catch (err) {
            setSendError(err);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <button style={bottomButtonStyle} onClick={openAndCall}>
                Trigger Random Error
            </button>

            {open && (
                <div style={overlayStyle} role="dialog" aria-modal="true">
                    <div style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <strong>Random Error endpoint</strong>
                            <div>
                                <button onClick={() => { callError(); }} style={{ marginRight: 8 }}>Retry</button>
                                <button onClick={() => setOpen(false)}>Close</button>
                            </div>
                        </div>

                        <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12, borderRadius: 6, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                            {loading && <div>Loading…</div>}
                            {!loading && result && <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{JSON.stringify(result, null, 2)}</pre>}
                            {!loading && error && (
                                <div>
                                    <div style={{ color: 'crimson', marginBottom: 8 }}>Request failed</div>
                                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{JSON.stringify(error, null, 2)}</pre>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button onClick={sendToIncidents} disabled={sending || loading || !currentText()}>
                                {sending ? 'Sending…' : 'Send'}
                            </button>
                            {sendSuccess && <span style={{ color: 'green' }}>{sendSuccess}</span>}
                            {sendError && <span style={{ color: 'crimson' }}>{typeof sendError === 'string' ? sendError : 'Send failed'}</span>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}