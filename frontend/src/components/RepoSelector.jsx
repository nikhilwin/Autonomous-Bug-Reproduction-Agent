import React, { useState } from 'react';
import { FolderGit2, Code2, Layers, CheckCircle2, FileCode, Plus, Download, Sparkles } from 'lucide-react';

export default function RepoSelector({ activeProject, onProjectImport }) {
  const [showModal, setShowModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [projName, setProjName] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  if (!activeProject) return null;

  const frameworks = activeProject.framework_info?.frameworks || ['Node.js / Express'];
  const fileCount = activeProject.framework_info?.file_count || 14;

  const handleImport = async (e) => {
    e.preventDefault();
    if (!repoUrl) return;

    setIsImporting(true);
    const inferredName = projName || repoUrl.rstrip?.('/')?.split('/')?.pop() || 'Imported GitHub Repository';

    try {
      const res = await fetch('/api/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inferredName,
          local_path: repoUrl,
          repo_url: repoUrl
        })
      });
      const data = await res.json();
      if (onProjectImport) onProjectImport(data);
      setShowModal(false);
      setRepoUrl('');
      setProjName('');
    } catch (err) {
      console.error('Failed to import repo:', err);
    } finally {
      setIsImporting(false);
    }
  };

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
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
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

          <button
            onClick={() => setShowModal(true)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.55rem 0.9rem' }}
          >
            <Plus size={15} /> Import GitHub Repo
          </button>
        </div>
      </div>

      {/* GitHub Import Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(4, 7, 17, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel glass-glow" style={{ width: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={20} color="var(--accent-cyan)" /> Import GitHub Repository
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              BugPilot will clone the repository, run static AST analysis, and index code symbols automatically.
            </p>

            <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  GitHub Repository URL or Local Path
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/user/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  Project Display Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. My E-Commerce App"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isImporting}
                  className="btn-cyber"
                >
                  {isImporting ? 'Cloning & Indexing...' : 'Import & Index Repo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
