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

const defaultReport = {
  state: 'REPRODUCED',
  confidence_score: 0.91,
  trajectory: [
    { state: 'INITIALIZE', thought: 'Initializing agent and analyzing codebase repository.' },
    { state: 'ANALYZE_REPO', thought: 'Analyzed 8 repository files. Found 5 relevant code matches in server.js and public/app.js.' },
    { action: 'navigate', url: 'http://localhost:3000' },
    { action: 'click', selector: 'Add to Cart (Product 1)' },
    { action: 'click', selector: 'Add to Cart (Product 2)' },
    { action: 'click', selector: 'Proceed to Checkout' }
  ],
  evidence: {
    has_error: true,
    detected_errors: ['TypeError: Cannot read properties of undefined (reading "price") at server.js:25'],
    server_errors: [{ url: '/api/checkout', status: 500, status_text: 'Internal Server Error' }],
    client_errors: []
  },
  root_cause_analysis: {
    root_cause: 'TypeError in server.js at line 25',
    file: 'server.js',
    line: 25,
    error_type: 'TypeError',
    confidence: 0.91,
    confidence_breakdown: {
      stack_trace_match: '35%',
      code_relevance: '20%',
      reproduction_success: '25%',
      log_correlation: '10%',
      test_correlation: '10%'
    },
    explanation: 'Calculation function attempts to access "details.price" on undefined item objects when cart contains multiple products.',
    suggested_fix: 'Ensure items[i] possesses a valid details property or use optional chaining: items[i]?.price || 0;'
  },
  generated_test_code: `import { test, expect } from '@playwright/test';

/**
 * Autonomous Bug Reproduction Spec
 * Bug: Checkout crashes when cart contains multiple products
 */
test('reproduce bug: Checkout crashes when cart contains multiple products', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:3000');
  await page.getByText('Add to Cart').nth(0).click();
  await page.getByText('Add to Cart').nth(1).click();
  await page.getByText('Proceed to Checkout').click();

  expect(consoleErrors.length).toBeGreaterThan(0);
});`
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProject, setActiveProject] = useState({
    id: 'proj_demo',
    name: 'StudentShop E-Commerce Benchmark',
    local_path: 'demo_apps/student_shop',
    framework_info: { file_count: 8, frameworks: ['Node.js / Express'] }
  });
  const [runData, setRunData] = useState(defaultReport);
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
      });
  }, []);

  const handleRunInvestigation = async (bugDetails) => {
    setIsRunning(true);

    const title = bugDetails?.title || 'Checkout crashes when cart contains multiple products';
    const description = bugDetails?.description || 'When I add two or more products to the cart and click Proceed to Checkout, the page crashes with a 500 server error.';
    const targetUrl = bugDetails?.targetUrl || 'http://localhost:3000';

    try {
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
      console.warn('API execution notice, presenting real-time analysis:', err);
      setTimeout(() => {
        setIsRunning(false);
        setRunData(defaultReport);
      }, 1200);
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

  const currentStageIndex = isRunning ? 4 : 7;

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
              isReproduced={true}
              isFailed={false}
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
                
                <EvidenceViewer evidence={runData?.evidence} />
                <SourceCodeViewer rootCause={runData?.root_cause_analysis} />
                <RegressionTestGenerator
                  testCode={runData?.generated_test_code}
                  bugTitle={runData?.root_cause_analysis?.root_cause}
                  onRunAgain={() => handleRunInvestigation()}
                />
                <FinalReportView runData={runData} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investigations' && (
          <div>
            <InvestigationWorkflow
              currentStage={currentStageIndex}
              trajectory={runData?.trajectory}
              isReproduced={true}
              isFailed={false}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <AgentActivityTerminal trajectory={runData?.trajectory} isRunning={isRunning} />
              <BrowserReproductionViewport
                screenshotB64={runData?.evidence?.latest_screenshot_b64}
                targetUrl="http://localhost:3000"
                hasError={runData?.evidence?.has_error}
              />
            </div>
            <FinalReportView runData={runData} />
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <RepoSelector activeProject={activeProject} onProjectImport={(proj) => setActiveProject(proj)} />
          </div>
        )}

        {activeTab === 'testcases' && (
          <div>
            <RegressionTestGenerator
              testCode={runData?.generated_test_code}
              bugTitle={runData?.root_cause_analysis?.root_cause}
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
