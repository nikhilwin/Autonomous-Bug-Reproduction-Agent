import React from 'react';
import { Terminal, Check, ArrowRight, X, Sparkles } from 'lucide-react';

export default function AgentActivityTerminal({ trajectory, isRunning }) {
  // Synthesize developer log lines matching requested specification
  const logs = [
    { type: 'success', text: 'Repository cloned & AST indexed' },
    { type: 'success', text: 'Detected React + Express Node.js architecture' },
    { type: 'success', text: 'Searching for checkout components & calculateTotal handler' },
    { type: 'success', text: 'Found target files: backend/server.js and public/app.js' },
    { type: 'info', text: 'Starting target application sandbox on http://localhost:3000' },
    { type: 'info', text: 'Launching Playwright Chromium browser driver' },
    { type: 'info', text: 'Navigating to http://localhost:3000' },
    { type: 'info', text: 'Clicking "Add to Cart" (Product 1)' },
    { type: 'info', text: 'Clicking "Add to Cart" (Product 2)' },
    { type: 'info', text: 'Clicking "Proceed to Checkout"' },
    { type: 'error', text: 'TypeError: Cannot read properties of undefined (reading "price") at server.js:25' },
    { type: 'success', text: 'DOM Frame snapshot & evidence captured' },
    { type: 'success', text: 'Root cause pinpointed & Playwright spec test generated' }
  ];

  const visibleLogs = trajectory && trajectory.length > 0
    ? logs.slice(0, Math.min(trajectory.length * 2, logs.length))
    : logs;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>🤖 Agent Activity Stream</h3>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
          {visibleLogs.length} LOG MESSAGES
        </span>
      </div>

      <div style={{
        background: '#040711',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '1.1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.84rem',
        maxHeight: '280px',
        overflowY: 'auto'
      }}>
        {visibleLogs.map((log, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            {log.type === 'success' && <Check size={14} color="#34d399" style={{ flexShrink: 0 }} />}
            {log.type === 'info' && <ArrowRight size={14} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />}
            {log.type === 'error' && <X size={14} color="#fb7185" style={{ flexShrink: 0 }} />}

            <span style={{
              color: log.type === 'success' ? '#6ee7b7' : log.type === 'error' ? '#fb7185' : 'var(--text-main)'
            }}>
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
