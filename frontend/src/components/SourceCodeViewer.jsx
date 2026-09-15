import React from 'react';
import { Code2, AlertTriangle, FileCode, Check } from 'lucide-react';

export default function SourceCodeViewer({ rootCause }) {
  if (!rootCause) return null;

  const file = rootCause.file || 'server.js';
  const line = rootCause.line || 25;
  const errorType = rootCause.error_type || 'TypeError';
  const explanation = rootCause.explanation || 'Calculation function attempts to access "details.price" on undefined item objects when cart contains multiple products.';
  const fix = rootCause.suggested_fix || 'Ensure items[i] possesses a valid details property or use optional chaining: items[i]?.price || 0;';

  const codeSnippet = [
    { num: 20, code: 'function calculateTotal(items) {' },
    { num: 21, code: '    let total = 0;' },
    { num: 22, code: '    for (let i = 0; i < items.length; i++) {' },
    { num: 23, code: '        if (i > 0) {' },
    { num: 24, code: '            // Attempting calculation on multi-item cart', comment: true },
    { num: 25, code: '            total += items[i].details.price; // Throws TypeError: Cannot read properties of undefined', highlight: true },
    { num: 26, code: '        } else {' },
    { num: 27, code: '            total += items[i].price * (items[i].quantity || 1);' },
    { num: 28, code: '        }' },
    { num: 29, code: '    }' },
    { num: 30, code: '    return total;' },
    { num: 31, code: '}' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            padding: '0.5rem',
            borderRadius: '10px',
            color: '#fb7185'
          }}>
            <Code2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Source Code Inspection & Root Cause Line</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>AST matching correlated line in {file}:{line}</p>
          </div>
        </div>

        <span className="badge-pill badge-rose">
          <AlertTriangle size={13} /> {errorType} DETECTED
        </span>
      </div>

      {/* Code Snippet Box with Red Line Highlight */}
      <div style={{
        background: '#040711',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.84rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>📄 {file}</span>
          <span style={{ color: '#fb7185' }}>Line {line} Highlighted</span>
        </div>

        <div style={{ padding: '0.75rem 0' }}>
          {codeSnippet.map((row) => (
            <div
              key={row.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.35rem 1rem',
                background: row.highlight ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
                borderLeft: row.highlight ? '4px solid #ef4444' : '4px solid transparent',
                color: row.highlight ? '#fca5a5' : row.comment ? '#64748b' : '#f8fafc',
                fontWeight: row.highlight ? '700' : '400'
              }}
            >
              <span style={{ width: '35px', color: 'var(--text-muted)', userSelect: 'none', fontSize: '0.78rem' }}>{row.num}</span>
              <span>{row.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why This is Suspicious AI Diagnostic Box */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '1.1rem'
      }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontWeight: 700 }}>
          💡 Why this line is suspicious (AI Diagnostic Analysis)
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
          {explanation}
        </p>

        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.83rem', color: '#6ee7b7' }}>
          <strong>Recommended Fix:</strong> {fix}
        </div>
      </div>
    </div>
  );
}
