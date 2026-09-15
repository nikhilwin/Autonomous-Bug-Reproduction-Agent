import React, { useState } from 'react';
import { TestTube2, Copy, Download, Play, Check } from 'lucide-react';

export default function RegressionTestGenerator({ testCode, bugTitle, onRunAgain }) {
  const [copied, setCopied] = useState(false);

  if (!testCode) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(testCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([testCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checkout-multiple-products.spec.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'rgba(0, 242, 254, 0.15)',
            padding: '0.5rem',
            borderRadius: '10px',
            color: 'var(--accent-cyan)'
          }}>
            <TestTube2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>🧪 Generated Playwright Regression Test</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>tests/checkout-multiple-products.spec.ts</p>
          </div>
        </div>

        {/* Action Buttons: Copy, Download, Run Again */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleCopy} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}>
            {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button onClick={handleDownload} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}>
            <Download size={14} /> Download
          </button>

          <button onClick={onRunAgain} className="btn-cyber" style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}>
            <Play size={14} /> Run Again
          </button>
        </div>
      </div>

      {/* Code Display */}
      <pre style={{
        background: '#040711',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '1.25rem',
        color: '#38bdf8',
        fontSize: '0.84rem',
        fontFamily: 'var(--font-mono)',
        overflowX: 'auto'
      }}>
        {testCode}
      </pre>
    </div>
  );
}
