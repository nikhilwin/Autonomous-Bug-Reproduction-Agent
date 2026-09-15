import React, { useState } from 'react';
import { Camera, AlertTriangle, Network, Terminal, Eye, ExternalLink } from 'lucide-react';

export default function EvidenceViewer({ evidence }) {
  const [tab, setTab] = useState('screenshot');
  const [showFullImg, setShowFullImg] = useState(false);

  if (!evidence) return null;

  const screenshotB64 = evidence.latest_screenshot_b64;
  const detectedErrors = evidence.detected_errors || [];
  const serverErrors = evidence.server_errors || [];

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'rgba(121, 40, 202, 0.15)',
            padding: '0.5rem',
            borderRadius: '10px',
            color: '#c084fc'
          }}>
            <Camera size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>Evidence Vault</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Automated DOM frames, console traces & HTTP payloads</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(6, 9, 19, 0.6)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setTab('screenshot')}
            className={`btn-secondary ${tab === 'screenshot' ? 'glass-glow' : ''}`}
            style={{
              background: tab === 'screenshot' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: tab === 'screenshot' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.4rem 0.8rem',
              fontSize: '0.78rem'
            }}
          >
            📸 Screenshot
          </button>
          <button
            onClick={() => setTab('console')}
            style={{
              background: tab === 'console' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
              color: tab === 'console' ? '#fb7185' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.4rem 0.8rem',
              fontSize: '0.78rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ⚠️ Console ({detectedErrors.length})
          </button>
          <button
            onClick={() => setTab('network')}
            style={{
              background: tab === 'network' ? 'rgba(121, 40, 202, 0.15)' : 'transparent',
              color: tab === 'network' ? '#c084fc' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.4rem 0.8rem',
              fontSize: '0.78rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🌐 Network ({serverErrors.length})
          </button>
        </div>
      </div>

      {/* Screenshot Tab */}
      {tab === 'screenshot' && (
        <div style={{ textAlign: 'center', background: '#040711', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          {screenshotB64 ? (
            <div>
              <img
                src={`data:image/png;base64,${screenshotB64}`}
                alt="Playwright Frame Snapshot"
                style={{
                  maxWidth: '100%',
                  maxHeight: '340px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glow)',
                  boxShadow: '0 0 25px rgba(0, 242, 254, 0.15)',
                  cursor: 'pointer'
                }}
                onClick={() => setShowFullImg(!showFullImg)}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <Eye size={13} /> Click image to enlarge frame preview
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', padding: '2.5rem' }}>No Playwright screenshots captured yet.</p>
          )}
        </div>
      )}

      {/* Console Tab */}
      {tab === 'console' && (
        <div style={{
          background: '#040711',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          color: '#fb7185',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.84rem',
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          {detectedErrors.length > 0 ? (
            detectedErrors.map((err, i) => (
              <div key={i} style={{ marginBottom: '0.75rem', padding: '0.6rem', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', gap: '0.6rem' }}>
                <AlertTriangle size={16} color="#fb7185" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span>{err}</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No uncaught console errors recorded.</p>
          )}
        </div>
      )}

      {/* Network Tab */}
      {tab === 'network' && (
        <div style={{
          background: '#040711',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.84rem'
        }}>
          {serverErrors.length > 0 ? (
            serverErrors.map((req, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-main)' }}>{req.url}</span>
                <span className="badge-pill badge-rose">
                  HTTP {req.status} SERVER ERROR
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No failed HTTP network requests (&gt;=400).</p>
          )}
        </div>
      )}
    </div>
  );
}
