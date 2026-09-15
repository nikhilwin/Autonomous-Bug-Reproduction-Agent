import React from 'react';
import { Activity, CheckCircle2, Search, Globe, Code, Terminal, ArrowRight } from 'lucide-react';

export default function AgentExecutionVisualizer({ runData }) {
  if (!runData) return null;

  const trajectory = runData.trajectory || [];
  const state = runData.state || "INITIALIZING";

  const statesList = [
    { name: 'INITIALIZE', label: '1. Init Engine' },
    { name: 'ANALYZE_REPO', label: '2. Code Indexing' },
    { name: 'PLAN_REPRODUCTION', label: '3. Planning' },
    { name: 'EXECUTING', label: '4. Playwright Run' },
    { name: 'COLLECT_EVIDENCE', label: '5. Evidence Vault' },
    { name: 'REPRODUCED', label: '6. Root Cause' }
  ];

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
            <Activity size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>Agent Trajectory & State Machine</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Real-time autonomous tool calls and reasoning trace</p>
          </div>
        </div>

        <span className={`badge-pill ${state === 'REPRODUCED' ? 'badge-rose' : 'badge-cyan'}`}>
          <span className={state === 'RUNNING' ? 'pulse-beacon pulse-beacon-running' : 'pulse-beacon'} />
          STATE: {state}
        </span>
      </div>

      {/* State Machine Flow Pipeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${statesList.length}, 1fr)`,
        gap: '0.5rem',
        marginBottom: '1.5rem',
        background: 'rgba(6, 9, 19, 0.6)',
        padding: '0.75rem',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)'
      }}>
        {statesList.map((s, idx) => {
          const isDone = trajectory.some(item => item.state === s.name || item.action);
          const isCurrent = state === s.name;
          return (
            <div
              key={idx}
              style={{
                background: isCurrent ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isCurrent ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                padding: '0.6rem 0.4rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.73rem',
                fontWeight: 700,
                color: isCurrent ? 'var(--accent-cyan)' : isDone ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: isCurrent ? '0 0 15px rgba(0, 242, 254, 0.2)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {s.label}
            </div>
          );
        })}
      </div>

      {/* Live Trajectory Logs Terminal */}
      <div style={{
        background: '#040711',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '1.1rem',
        maxHeight: '300px',
        overflowY: 'auto',
        fontSize: '0.84rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Terminal size={14} color="var(--accent-cyan)" /> AGENT EXECUTION STREAM LOG
          </span>
          <span style={{ color: 'var(--accent-cyan)' }}>{trajectory.length} STEPS RECORDED</span>
        </div>

        {trajectory.map((step, i) => (
          <div key={i} style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px dotted rgba(255, 255, 255, 0.06)' }}>
            {step.thought && (
              <div style={{ color: '#c084fc', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Search size={14} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <span><strong style={{ color: '#e9d5ff' }}>THOUGHT:</strong> {step.thought}</span>
              </div>
            )}

            {step.action && (
              <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={14} style={{ flexShrink: 0 }} />
                <span><strong style={{ color: '#6ee7b7' }}>ACTION [{step.action.toUpperCase()}]:</strong> {step.selector || step.url || ''}</span>
              </div>
            )}

            {step.code_matches && (
              <div style={{ marginTop: '0.4rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>FOUND CODE MATCHES:</span>
                {step.code_matches.map((m, idx) => (
                  <div key={idx} style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    📍 {m.file}:{m.line_number} → <code style={{ color: '#f8fafc' }}>{m.line_content}</code>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
