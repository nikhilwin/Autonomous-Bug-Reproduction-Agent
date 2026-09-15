import React from 'react';
import { Globe, RefreshCw, AlertTriangle, CheckCircle, Camera } from 'lucide-react';

export default function BrowserReproductionViewport({ screenshotB64, targetUrl, hasError }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={18} color="var(--accent-cyan)" /> Live Playwright Browser Reproduction
        </h3>
        <span className={`badge-pill ${hasError ? 'badge-rose' : 'badge-emerald'}`}>
          {hasError ? 'HTTP 500 Internal Error 🔴' : 'Browser Session Active'}
        </span>
      </div>

      {/* Browser Frame Window */}
      <div style={{
        background: '#0a0f1d',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {/* Browser Address Bar */}
        <div style={{
          background: '#040711',
          padding: '0.65rem 1rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          </div>

          <div style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '0.3rem 0.75rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem'
          }}>
            🔒 {targetUrl || 'http://localhost:3000'}
          </div>

          <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>
            Action: Click → Proceed to Checkout
          </span>
        </div>

        {/* Viewport Content */}
        <div style={{ padding: '1rem', textAlign: 'center', background: '#000', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {screenshotB64 ? (
            <img
              src={`data:image/png;base64,${screenshotB64}`}
              alt="Playwright Execution Snapshot"
              style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
            />
          ) : (
            <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
              <Camera size={36} color="var(--border-subtle)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>Playwright browser executing interactive reproduction workflow...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
