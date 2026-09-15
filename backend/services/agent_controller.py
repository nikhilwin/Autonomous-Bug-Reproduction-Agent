import asyncio
from typing import Dict, Any, List
from backend.services.repo_analyzer import RepoAnalyzer
from backend.services.browser_driver import PlaywrightBrowserDriver
from backend.services.evidence_collector import EvidenceCollector
from backend.services.root_cause_analyzer import RootCauseAnalyzer
from backend.services.test_generator import TestGenerator

class AgentController:
    def __init__(self, repo_path: str, bug_title: str, bug_description: str, target_url: str = "http://localhost:3000"):
        self.repo_path = repo_path
        self.bug_title = bug_title
        self.bug_description = bug_description
        self.target_url = target_url
        self.trajectory: List[Dict[str, Any]] = []

    async def run(self) -> Dict[str, Any]:
        """Executes the autonomous bug reproduction state machine trajectory."""
        
        # State 1: INITIALIZE & ANALYZE REPO
        self.trajectory.append({"state": "INITIALIZE", "thought": "Initializing agent and analyzing codebase repository."})
        analyzer = RepoAnalyzer(self.repo_path)
        repo_meta = analyzer.analyze_metadata()
        code_matches = analyzer.search_code("checkout")
        
        self.trajectory.append({
            "state": "ANALYZE_REPO",
            "thought": f"Analyzed {repo_meta.get('file_count', 0)} files. Found {len(code_matches)} relevant checkout code occurrences.",
            "code_matches": code_matches[:5]
        })

        # State 2: PLAN REPRODUCTION
        self.trajectory.append({
            "state": "PLAN_REPRODUCTION",
            "thought": "Plan: Open homepage, add 2 products to cart to trigger multi-item checkout condition, then click Checkout."
        })

        # State 3: BROWSER AUTOMATION EXECUTION
        driver = PlaywrightBrowserDriver()
        detected_errors = []

        try:
            # Step A: Navigate to target URL
            nav_res = await driver.navigate(self.target_url)
            self.trajectory.append({"action": "navigate", "url": self.target_url, "result": nav_res})
            await driver.take_screenshot()

            # Step B: Add Product 1 to cart
            click1 = await driver.click("Add to Cart")
            self.trajectory.append({"action": "click", "selector": "Add to Cart (Product 1)", "result": click1})
            await asyncio.sleep(0.5)

            # Step C: Add Product 2 to cart
            click2 = await driver.click("Add to Cart")
            self.trajectory.append({"action": "click", "selector": "Add to Cart (Product 2)", "result": click2})
            await asyncio.sleep(0.5)

            # Take screenshot of cart with 2 products
            await driver.take_screenshot()

            # Step D: Click Checkout
            checkout_click = await driver.click("Proceed to Checkout")
            self.trajectory.append({"action": "click", "selector": "Proceed to Checkout", "result": checkout_click})
            await asyncio.sleep(1.0)

            # Take screenshot after checkout attempt
            await driver.take_screenshot()

            # Collect errors from console
            for log in driver.console_logs:
                if "CHECKOUT_FAILED_ERROR" in log.get("text", "") or "SERVER_STACK_TRACE" in log.get("text", ""):
                    detected_errors.append(log.get("text"))

        except Exception as e:
            detected_errors.append(f"Browser execution exception: {str(e)}")

        # State 4: COLLECT EVIDENCE
        evidence = EvidenceCollector.format_evidence(
            console_logs=driver.console_logs,
            network_logs=driver.network_logs,
            screenshots=driver.screenshots,
            trajectory=self.trajectory,
            detected_errors=detected_errors
        )

        await driver.close()

        # State 5: ROOT CAUSE ANALYSIS & TEST GENERATION
        root_cause = RootCauseAnalyzer.analyze(
            bug_title=self.bug_title,
            bug_description=self.bug_description,
            evidence=evidence,
            code_matches=code_matches
        )

        test_code = TestGenerator.generate_playwright_test(
            target_url=self.target_url,
            trajectory=self.trajectory,
            bug_title=self.bug_title
        )

        state_status = "REPRODUCED" if evidence.get("has_error") else "FAILED"

        return {
            "state": state_status,
            "trajectory": self.trajectory,
            "evidence": evidence,
            "root_cause_analysis": root_cause,
            "generated_test_code": test_code,
            "confidence_score": root_cause.get("confidence", 0.0)
        }
