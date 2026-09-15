from typing import List, Dict, Any

class TestGenerator:
    @staticmethod
    def generate_playwright_test(target_url: str, trajectory: List[Dict[str, Any]], bug_title: str) -> str:
        """Generates a Playwright test specification file based on agent action trajectory."""
        
        steps_code = []
        for step in trajectory:
            action = step.get("action")
            if action == "navigate":
                steps_code.append(f"  await page.goto('{step.get('url', target_url)}');")
            elif action == "click":
                selector = step.get("selector", "")
                if selector.startswith(".") or selector.startswith("#"):
                    steps_code.append(f"  await page.locator('{selector}').click();")
                else:
                    steps_code.append(f"  await page.getByText('{selector}').click();")
            elif action == "fill":
                steps_code.append(f"  await page.locator('{step.get('selector')}').fill('{step.get('value')}');")

        steps_str = "\n".join(steps_code) if steps_code else "  await page.goto('" + target_url + "');"

        code = f"""import {{ test, expect }} from '@playwright/test';

/**
 * Autonomous Bug Reproduction Test
 * Bug: {bug_title}
 */
test('reproduce bug: {bug_title}', async ({{ page }}) => {{
  // 1. Setup console & error listeners
  const consoleErrors: string[] = [];
  page.on('console', msg => {{
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  }});

  // 2. Perform recorded reproduction sequence
{steps_str}

  // 3. Assertion: Check if error occurred
  expect(consoleErrors.length).toBeGreaterThan(0);
}});
"""
        return code
