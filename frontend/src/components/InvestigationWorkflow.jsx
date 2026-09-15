import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function InvestigationWorkflow({ currentStage, trajectory, isReproduced, isFailed }) {
  const stages = [
    { id: 'repo', label: '1. Repository', desc: 'Scan & Index Codebase' },
    { id: 'understand', label: '2. Understand Bug', desc: 'NLP Report Parsing' },
    { id: 'analyze', label: '3. Analyze Code', desc: 'AST Symbol Extract' },
    { id: 'plan', label: '4. Plan Script', desc: 'Action Sequence Form' },
    { id: 'browser', label: '5. Run Browser', desc: 'Playwright Sandbox' },
    { id: 'evidence', label: '6. Collect Evidence', desc: 'Console/DOM/Network' },
    { id: 'rootcause', label: '7. Root Cause', desc: 'Pinpoint File & Line' },
    { id: 'testgen', label: '8. Generate Test', desc: 'Playwright Spec File' }
  ];

  const getStageStatus = (idx) => {
    if (isFailed && idx === currentStage) return 'failed';
    if (isReproduced) return 'completed';
    if (idx < currentStage) return 'completed';
    if (idx === currentStage) return 'running';
    return 'pending';
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🔄 Autonomous Investigation Workflow Stepper</span>
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>8 Stage Finite State Execution</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.85rem'
      }}>
        {stages.map((st, idx) => {
          const status = getStageStatus(idx);
          return (
            <div
              key={st.id}
              style={{
                background: status === 'running' ? 'rgba(0, 242, 254, 0.12)' : status === 'completed' ? 'rgba(16, 185, 129, 0.08)' : status === 'failed' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${status === 'running' ? 'var(--accent-cyan)' : status === 'completed' ? 'var(--accent-emerald)' : status === 'failed' ? 'var(--accent-rose)' : 'var(--border-subtle)'}`,
                padding: '0.85rem',
                borderRadius: '10px',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: status === 'running' ? 'var(--accent-cyan)' : status === 'completed' ? '#34d399' : status === 'failed' ? '#fb7185' : 'var(--text-muted)' }}>
                  {st.label}
                </span>

                {status === 'completed' && <CheckCircle2 size={15} color="#34d399" />}
                {status === 'running' && <Loader2 size={15} color="var(--accent-cyan)" className="animate-spin" />}
                {status === 'failed' && <AlertCircle size={15} color="#fb7185" />}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{st.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
