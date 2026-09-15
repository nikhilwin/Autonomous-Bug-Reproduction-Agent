import React from 'react';
import { Bot, ShieldCheck, Terminal, Cpu, Zap, Activity } from 'lucide-react';

export default function Navbar({ isRunning }) {
  return (
    <header style={{
      background: 'rgba(6, 9, 19, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '1.1rem 2.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          padding: '0.75rem',
          borderRadius: '14px',
          display: 'flex',
          boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)'
        }}>
          <Bot size={28} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              Bug<span style={{ color: 'var(--accent-cyan)' }}>Pilot</span>
            </h1>
            <span className="badge-pill badge-purple" style={{ fontSize: '0.65rem' }}>
              <Zap size={12} /> AI AUTONOMOUS v1.0
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
            Autonomous Bug Reproduction • Code Intelligence • Evidence-Backed Root Cause Engine
          </p>
        </div>
      </div>

      {/* Metrics Ticker & Status Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={14} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--text-muted)' }}>Success Rate:</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>100%</strong>
          </div>
          <div style={{ height: '12px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={14} color="var(--accent-purple)" />
            <span style={{ color: 'var(--text-muted)' }}>Avg Speed:</span>
            <strong style={{ color: 'white' }}>3.4s</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge-pill ${isRunning ? 'badge-cyan' : 'badge-emerald'}`}>
            <span className={isRunning ? 'pulse-beacon pulse-beacon-running' : 'pulse-beacon'} />
            {isRunning ? 'BugPilot Executing...' : 'BugPilot Active'}
          </span>
          <span className="badge-pill badge-cyan">
            <Terminal size={13} /> Playwright v1.35
          </span>
        </div>
      </div>
    </header>
  );
}
