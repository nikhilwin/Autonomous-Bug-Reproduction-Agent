import React from 'react';
import { FolderGit2, Code2, Layers, CheckCircle2, FileCode } from 'lucide-react';

export default function RepoSelector({ activeProject }) {
  if (!activeProject) return null;

  const frameworks = activeProject.framework_info?.frameworks || ['Node.js / Express'];
  const fileCount = activeProject.framework_info?.file_count || 14;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Repo Information */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            padding: '0.65rem',
            borderRadius: '12px',
            color: 'var(--accent-cyan)'
          }}>
            <FolderGit2 size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>{activeProject.name}</h3>
              <span className="badge-pill badge-cyan" style={{ fontSize: '0.65rem' }}>
                <CheckCircle2 size={11} /> AST INDEXED
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              📁 {activeProject.local_path}
            </p>
          </div>
        </div>

        {/* Code Stats & Stack Info */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            padding: '0.5rem 0.9rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FileCode size={16} color="var(--accent-cyan)" />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Files: </span>
              <strong style={{ color: 'white' }}>{fileCount}</strong>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            padding: '0.5rem 0.9rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Code2 size={16} color="var(--accent-purple)" />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Stack: </span>
              <strong style={{ color: 'white' }}>{frameworks.join(', ')}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
