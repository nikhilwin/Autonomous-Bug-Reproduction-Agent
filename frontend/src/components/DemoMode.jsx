import React from 'react';
import { Sparkles, Play, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DemoMode({ onRunDemo, isRunning }) {
  return (
    <div className="glass-panel glass-glow" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--accent-cyan)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
            padding: '0.75rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <Sparkles size={26} />
          </div>
          <div>
            <span className="badge-pill badge-purple" style={{ fontSize: '0.65rem' }}>CONTROLLED BENCHMARK ENVIRONMENT</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', marginTop: '0.1rem' }}>
              1-Click Autonomous Demo Mode
            </h2>
          </div>
        </div>

        <button
          onClick={onRunDemo}
          disabled={isRunning}
          className="btn-cyber"
          style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem' }}
        >
          <Play size={18} /> {isRunning ? 'Executing Real Playwright Pipeline...' : 'Start Autonomous Investigation'}
        </button>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        This controlled benchmark automatically loads the <strong>StudentShop E-Commerce Application</strong> with 5 planted bugs and runs the end-to-end real Playwright browser engine, AST parser, evidence collector, root cause diagnoser, and test generator.
      </p>

      {/* Preset Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        background: 'rgba(6, 9, 19, 0.6)',
        padding: '1.25rem',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.85rem'
      }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Target App</div>
          <div style={{ fontWeight: 700, color: 'white' }}>StudentShop E-Commerce</div>
          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>http://localhost:3000</div>
        </div>

        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Target Bug</div>
          <div style={{ fontWeight: 700, color: '#fb7185' }}>Multi-Item Checkout Crash</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Cart array &gt; 1 item triggers 500</div>
        </div>

        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Expected Artifacts</div>
          <div style={{ fontWeight: 700, color: '#34d399' }}>Screenshot + Line 25 + Spec Code</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>tests/checkout-multiple-products.spec.ts</div>
        </div>
      </div>
    </div>
  );
}
