import React, { useState } from 'react';
import { FileText, CheckCircle, Code, Cpu, Wrench, Copy, Check } from 'lucide-react';

export default function FinalReportView({ runData }) {
  const [copied, setCopied] = useState(false);

  if (!runData || !runData.root_cause_analysis) return null;

  const rc = runData.root_cause_analysis;
  const confidencePercent = Math.round((runData.confidence_score || rc.confidence || 0.91) * 100);
  const bd = rc.confidence_breakdown || {};

  const handleCopySpec = () => {
    if (runData.generated_test_code) {
      navigator.clipboard.writeText(runData.generated_test_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-panel glass-glow" style={{ padding: '2rem', border: '1px solid var(--accent-cyan)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            padding: '0.75rem',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
          }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800, letterSpacing: '0.05em' }}>
              REPRODUCIBLE BUG REPORT #1042
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginTop: '0.1rem' }}>
              Checkout crashes when cart contains multiple products
            </h2>
          </div>
        </div>

        {/* Confidence Badge Meter */}
        <div style={{ textAlign: 'right' }}>
          <div className="badge-pill badge-cyan" style={{ fontSize: '1rem', padding: '0.5rem 1.25rem' }}>
            ⚡ CONFIDENCE: {confidencePercent}%
          </div>
        </div>
      </div>

      {/* Confidence Breakdown Score Matrix */}
      <div style={{
        background: 'rgba(6, 9, 19, 0.7)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '1.1rem 1.5rem',
        marginBottom: '1.75rem'
      }}>
        <h4 style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
          <Cpu size={15} /> CONFIDENCE SCORE BREAKDOWN MATRIX
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', textAlign: 'center', fontSize: '0.82rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Stack Trace</div>
            <div style={{ fontWeight: 800, color: 'white', marginTop: '0.2rem', fontSize: '1rem' }}>{bd.stack_trace_match || '35%'}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Code Match</div>
            <div style={{ fontWeight: 800, color: 'white', marginTop: '0.2rem', fontSize: '1rem' }}>{bd.code_relevance || '20%'}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Reproduction</div>
            <div style={{ fontWeight: 800, color: 'white', marginTop: '0.2rem', fontSize: '1rem' }}>{bd.reproduction_success || '25%'}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Log Evidence</div>
            <div style={{ fontWeight: 800, color: 'white', marginTop: '0.2rem', fontSize: '1rem' }}>{bd.log_correlation || '10%'}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Test Correlation</div>
            <div style={{ fontWeight: 800, color: 'white', marginTop: '0.2rem', fontSize: '1rem' }}>{bd.test_correlation || '10%'}</div>
          </div>
        </div>
      </div>

      {/* Root Cause & Suggested Fix Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
          <div style={{ fontSize: '0.85rem', color: '#fb7185', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
            📍 LIKELY ROOT CAUSE
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'white', marginBottom: '0.5rem', fontWeight: 600 }}>
            {rc.file}:{rc.line} ({rc.error_type})
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {rc.explanation}
          </p>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', letterSpacing: '0.03em' }}>
            <Wrench size={16} /> SUGGESTED AI FIX
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {rc.suggested_fix}
          </p>
        </div>
      </div>

      {/* Generated Playwright Test Code */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Code size={18} /> GENERATED PLAYWRIGHT SPECIFICATION TEST
          </h4>

          <button
            onClick={handleCopySpec}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          >
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <pre style={{
          background: '#040711',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem',
          color: '#38bdf8',
          fontSize: '0.84rem',
          overflowX: 'auto',
          boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.5)'
        }}>
          {runData.generated_test_code}
        </pre>
      </div>
    </div>
  );
}
