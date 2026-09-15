import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RepoSelector from './components/RepoSelector';
import BugForm from './components/BugForm';
import AgentExecutionVisualizer from './components/AgentExecutionVisualizer';
import EvidenceViewer from './components/EvidenceViewer';
import FinalReportView from './components/FinalReportView';
import GalaxyBackground from './components/GalaxyBackground';

export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeBug, setActiveBug] = useState(null);
  const [runData, setRunData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Register demo project on mount
    fetch('/api/projects/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'StudentShop E-Commerce Benchmark',
        local_path: 'demo_apps/student_shop',
        repo_url: 'https://github.com/demo/student-shop'
      })
    })
      .then(res => res.json())
      .then(proj => setActiveProject(proj))
      .catch(err => {
        console.warn('Backend connection, using local project context:', err);
        setActiveProject({
          id: 'proj_demo',
          name: 'StudentShop E-Commerce Benchmark',
          local_path: 'demo_apps/student_shop',
          framework_info: { file_count: 8, frameworks: ['Node.js / Express'] }
        });
      });
  }, []);

  const handleBugSubmit = async ({ title, description, targetUrl }) => {
    setIsRunning(true);
    setRunData(null);

    try {
      // 1. Create Bug Report
      const bugRes = await fetch('/api/bug-reports/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: activeProject?.id || 'proj_demo',
          title,
          description
        })
      });
      const bugData = await bugRes.json();
      setActiveBug(bugData);

      // 2. Trigger Agent Run
      const runRes = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bug_report_id: bugData.id,
          target_url: targetUrl
        })
      });
      const runRecord = await runRes.json();
      pollRunStatus(runRecord.id);

    } catch (err) {
      console.error('Failed to trigger agent run:', err);
      setIsRunning(false);
    }
  };

  const pollRunStatus = (runId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/agent/runs/${runId}`);
        const data = await res.json();
        setRunData(data);

        if (data.state === 'REPRODUCED' || data.state === 'FAILED') {
          clearInterval(interval);
          setIsRunning(false);
        }
      } catch (err) {
        console.error('Error polling status:', err);
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1500);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* OpenAI Astra Style 3D Particle Galaxy Animation Background */}
      <GalaxyBackground />

      <Navbar isRunning={isRunning} />

      <main style={{ maxWidth: '1350px', margin: '2rem auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        <RepoSelector activeProject={activeProject} />

        <div style={{ display: 'grid', gridTemplateColumns: runData ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          <div>
            <BugForm onSubmit={handleBugSubmit} isRunning={isRunning} />
            <AgentExecutionVisualizer runData={runData} />
          </div>

          {runData && (
            <div>
              <EvidenceViewer evidence={runData.evidence} />
              <FinalReportView runData={runData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
