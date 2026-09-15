# BugPilot 🤖

**BugPilot** is an AI-driven software engineering agent framework that receives a bug report and a Git repository, automatically navigates the web application using Playwright browser automation, captures evidence (console logs, network payloads, stack traces, screenshots), identifies root causes, and generates reproducible Playwright test scripts.

---

## 🏗️ Architecture

```
Bug Report & Codebase
       ↓
Repository Analyzer (AST & Code Search)
       ↓
BugPilot Controller (FSM + Tool Use Loop)
       ↓
Browser Driver (Playwright Automation)
       ↓
Evidence Collector & Root Cause Engine
       ↓
Playwright Test Spec & Bug Report
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
python -m playwright install chromium

# Start FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
```

### 3. Demo Target App ("StudentShop")
```bash
cd demo_apps/student_shop
npm install
npm start
# Runs at http://localhost:3000
```

### 4. BugPilot Frontend Control Panel
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173 (or 5174)
```
