import React from 'react';
import { ArrowRight, Play, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export default function HeroHeader({ onStartClick, onDemoClick, isRunning }) {
  return (
    <div className="glass-panel" style={{
      padding: '2.5rem',
      marginBottom: '2rem',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(0, 242, 254, 0.25)',
      boxShadow: '0 0 40px rgba(0, 242, 254, 0.1)'
    }}>
      <div style={{ maxWidth: '850px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
          <span className="badge-pill badge-cyan">
            <Cpu size={13} /> AUTONOMOUS QUALITY ENGINEERING ENGINE
          </span>
          <span className="badge-pill badge-emerald">
            <ShieldCheck size={13} /> PLAYWRIGHT SANDBOX READY
          </span>
        </div>

        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: '0.8rem'
        }}>
          AI that reproduces bugs <span style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>automatically.</span>
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '1.75rem'
        }}>
          Give BugPilot a GitHub repository and a bug report. It analyzes the codebase with static intelligence, launches the target application in a Playwright browser, reproduces the issue, collects full evidence, and identifies the exact root-cause file and line number.
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={onStartClick}
            disabled={isRunning}
            className="btn-cyber"
            style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem' }}
          >
            <Play size={18} /> Start Investigation <ArrowRight size={18} />
          </button>

          <button
            onClick={onDemoClick}
            disabled={isRunning}
            className="btn-secondary"
            style={{ fontSize: '0.9rem', padding: '0.75rem 1.4rem' }}
          >
            <Sparkles size={16} color="var(--accent-purple)" /> Try Demo Mode (Benchmark Bug #1042)
          </button>
        </div>
      </div>
    </div>
  );
}
