import React from 'react';
import { Bot, LayoutDashboard, Bug, FolderGit2, TestTube2, BarChart3, Play, Sparkles } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, onStartDemo, isRunning }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'investigations', label: 'Investigations', icon: Bug },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'testcases', label: 'Test Cases', icon: TestTube2 },
    { id: 'evaluation', label: 'Evaluation Metrics', icon: BarChart3 }
  ];

  return (
    <header style={{
      background: 'rgba(8, 12, 22, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.85rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                Bug<span style={{ color: 'var(--accent-cyan)' }}>Pilot</span>
              </span>
              <span className="badge-pill badge-purple" style={{ fontSize: '0.62rem' }}>AUTONOMOUS</span>
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav style={{ display: 'flex', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'rgba(0, 242, 254, 0.3)' : 'transparent'}`,
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Demo Mode Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onStartDemo}
          disabled={isRunning}
          className="btn-cyber"
          style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem' }}
        >
          <Sparkles size={16} /> {isRunning ? 'Running Demo...' : 'Try Demo Mode'}
        </button>
      </div>
    </header>
  );
}
