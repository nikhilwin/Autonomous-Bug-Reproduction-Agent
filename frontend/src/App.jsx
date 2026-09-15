import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroHeader from './components/HeroHeader';
import InvestigationWorkflow from './components/InvestigationWorkflow';
import AgentActivityTerminal from './components/AgentActivityTerminal';
import BrowserReproductionViewport from './components/BrowserReproductionViewport';
import SourceCodeViewer from './components/SourceCodeViewer';
import RegressionTestGenerator from './components/RegressionTestGenerator';
import DemoMode from './components/DemoMode';
import EvaluationDashboard from './components/EvaluationDashboard';
import RepoSelector from './components/RepoSelector';
import BugForm from './components/BugForm';
import EvidenceViewer from './components/EvidenceViewer';
import FinalReportView from './components/FinalReportView';
import GalaxyBackground from './components/GalaxyBackground';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProject, setActiveProject] = useState(null);
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

  const handleRunInvestigation = async (bugDetails) => {
    setIsRunning(true);
    setRunData(null);

    const title = bugDetails?.title || 'Checkout crashes when cart contains multiple products';
    const description = bugDetails?.description || 'When I add two or more products to the cart and click Proceed to Checkout, the page crashes with a 500 server error.';
    const targetUrl = bugDetails?.targetUrl || 'http://localhost:3000';

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

  const currentStageIndex = isRunning ? 4 : runData ? 7 : 0;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 3D Particle Galaxy Animation Background */}
      <GalaxyBackground />

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartDemo={() => {
          setActiveTab('dashboard');
          handleRunInvestigation();
        }}
        isRunning={isRunning}
      />

      <main style={{ maxWidth: '1350px', margin: '2rem auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        
        {activeTab === 'dashboard' && (
          <div>
            <HeroHeader
              onStartClick={() => handleRunInvestigation()}
              onDemoClick={() => handleRunInvestigation()}
              isRunning={isRunning}
            />

            <RepoSelector activeProject={activeProject} onProjectImport={(proj) => setActiveProject(proj)} />

            <InvestigationWorkflow
              currentStage={currentStageIndex}
              trajectory={runData?.trajectory}
              isReproduced={runData?.state === 'REPRODUCED'}
              isFailed={runData?.state === 'FAILED'}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <BugForm onSubmit={handleRunInvestigation} isRunning={isRunning} />
                <AgentActivityTerminal trajectory={runData?.trajectory} isRunning={isRunning} />
              </div>

              <div>
                <BrowserReproductionViewport
                  screenshotB64={runData?.evidence?.latest_screenshot_b64}
                  targetUrl="http://localhost:3000"
                  hasError={runData?.evidence?.has_error}
                />
                
                {runData && (
                  <div>
                    <EvidenceViewer evidence={runData.evidence} />
                    <SourceCodeViewer rootCause={runData.root_cause_analysis} />
                    <RegressionTestGenerator
                      testCode={runData.generated_test_code}
                      bugTitle={runData.root_cause_analysis?.root_cause}
                      onRunAgain={() => handleRunInvestigation()}
                    />
                    <FinalReportView runData={runData} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investigations' && (
          <div>
            <InvestigationWorkflow
              currentStage={currentStageIndex}
              trajectory={runData?.trajectory}
              isReproduced={runData?.state === 'REPRODUCED'}
              isFailed={runData?.state === 'FAILED'}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <AgentActivityTerminal trajectory={runData?.trajectory} isRunning={isRunning} />
              <BrowserReproductionViewport
                screenshotB64={runData?.evidence?.latest_screenshot_b64}
                targetUrl="http://localhost:3000"
                hasError={runData?.evidence?.has_error}
              />
            </div>
            {runData && <FinalReportView runData={runData} />}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <RepoSelector activeProject={activeProject} onProjectImport={(proj) => setActiveProject(proj)} />
          </div>
        )}

        {activeTab === 'testcases' && runData && (
          <div>
            <RegressionTestGenerator
              testCode={runData.generated_test_code}
              bugTitle={runData.root_cause_analysis?.root_cause}
              onRunAgain={() => handleRunInvestigation()}
            />
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div>
            <EvaluationDashboard />
          </div>
        )}

      </main>
    </div>
  );
}
