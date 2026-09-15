import React, { useState } from 'react';
import { Bug, Play, Sparkles, Terminal, AlertCircle } from 'lucide-react';

export default function BugForm({ onSubmit, isRunning }) {
  const [title, setTitle] = useState("Checkout crashes when cart contains multiple products");
  const [description, setDescription] = useState(
    "When I add two or more products to the cart and click Proceed to Checkout, the page crashes with a 500 server error."
  );
  const [targetUrl, setTargetUrl] = useState("");

  const presetBugs = [
    {
      id: 1,
      title: "Checkout crashes when cart contains multiple products",
      desc: "Add 2+ products to cart -> Click Checkout -> Returns HTTP 500 TypeError in server.js",
      url: "http://localhost:3000",
      tag: "BENCHMARK BUG #1"
    },
    {
      id: 2,
      title: "Invalid promo code crashes modal checkout",
      desc: "Enter 'PROMO50' on checkout modal -> Server throws uncaught validation exception",
      url: "http://localhost:3000",
      tag: "BENCHMARK BUG #2"
    },
    {
      id: 3,
      title: "Quantity NaN overflow on empty input",
      desc: "Clear product quantity input -> Submitting cart total returns NaN",
      url: "http://localhost:3000",
      tag: "BENCHMARK BUG #3"
    }
  ];

  const handleSelectPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    setTargetUrl(preset.url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, targetUrl });
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
      {/* Header & Demo Presets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            padding: '0.5rem',
            borderRadius: '10px',
            color: 'var(--accent-rose)'
          }}>
            <Bug size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>Bug Intake Console</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Describe the issue or select a benchmark bug</p>
          </div>
        </div>
      </div>

      {/* Preset Chips */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {presetBugs.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => handleSelectPreset(b)}
            style={{
              background: title === b.title ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${title === b.title ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
              color: title === b.title ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={13} /> {b.tag}
          </button>
        ))}
      </div>

      {/* Intake Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
            Bug Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Checkout crashes when cart contains multiple products"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
            Detailed User Report & Reproduction Hints
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe the steps to trigger the bug..."
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
            Target Application Base URL (Where app is running)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)', background: 'rgba(0, 242, 254, 0.1)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              🌐 TARGET
            </span>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="e.g. http://localhost:3000 or https://your-app.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isRunning}
          className="btn-cyber"
          style={{ alignSelf: 'flex-start', marginTop: '0.5rem', opacity: isRunning ? 0.6 : 1 }}
        >
          <Play size={18} /> {isRunning ? "Autonomous Agent Executing..." : "Trigger Reproduction Agent"}
        </button>
      </form>
    </div>
  );
}
