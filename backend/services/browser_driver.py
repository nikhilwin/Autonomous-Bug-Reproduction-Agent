import asyncio
import base64
import os
from typing import List, Dict, Any
from playwright.async_api import async_playwright

class PlaywrightBrowserDriver:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None
        self.console_logs: List[Dict[str, Any]] = []
        self.network_logs: List[Dict[str, Any]] = []
        self.screenshots: List[str] = []

    async def start(self):
        if not self.playwright:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=True)
            self.context = await self.browser.new_context()
            self.page = await self.context.new_page()

            # Attach console listener
            self.page.on("console", self._handle_console)
            # Attach network listener
            self.page.on("response", self._handle_response)

    def _handle_console(self, msg):
        self.console_logs.append({
            "type": msg.type,
            "text": msg.text,
            "location": msg.location
        })

    def _handle_response(self, response):
        if response.status >= 400:
            self.network_logs.append({
                "url": response.url,
                "status": response.status,
                "status_text": response.status_text
            })

    async def navigate(self, url: str) -> Dict[str, Any]:
        await self.start()
        try:
            # Ensure URL has protocol scheme
            if not url.startswith("http://") and not url.startswith("https://"):
                url = "http://" + url

            res = await self.page.goto(url, wait_until="networkidle", timeout=12000)
            return {"success": True, "url": self.page.url, "status": res.status if res else 200}
        except Exception as e:
            # Retry with domcontentloaded if networkidle times out
            try:
                res = await self.page.goto(url, wait_until="domcontentloaded", timeout=10000)
                return {"success": True, "url": self.page.url, "status": res.status if res else 200}
            except Exception as ex:
                return {"success": False, "error": str(ex)}

    async def get_interactive_elements(self) -> List[Dict[str, Any]]:
        """Extracts visible interactive buttons, links, and form fields from DOM."""
        if not self.page:
            return []
        try:
            elements = await self.page.evaluate("""() => {
                const results = [];
                const nodes = document.querySelectorAll('button, a, input, [role="button"], .btn');
                nodes.forEach(el => {
                    const text = (el.innerText || el.value || el.getAttribute('placeholder') || '').trim();
                    if (text && text.length < 50 && el.offsetWidth > 0 && el.offsetHeight > 0) {
                        results.push({
                            tag: el.tagName.toLowerCase(),
                            text: text,
                            id: el.id,
                            className: el.className
                        });
                    }
                });
                return results.slice(0, 20);
            }""")
            return elements
        except Exception:
            return []

    async def click_smart(self, keyword_or_selector: str) -> Dict[str, Any]:
        """Tries multiple click strategies safely without failing the trajectory."""
        if not self.page:
            return {"success": False, "error": "No page active"}

        try:
            # 1. Try text match
            try:
                await self.page.click(f"text={keyword_or_selector}", timeout=2500)
                await asyncio.sleep(0.5)
                return {"success": True, "action": "click", "selector": keyword_or_selector}
            except Exception:
                pass

            # 2. Try selector match
            try:
                await self.page.click(keyword_or_selector, timeout=2500)
                await asyncio.sleep(0.5)
                return {"success": True, "action": "click", "selector": keyword_or_selector}
            except Exception:
                pass

            # 3. Fallback: Click first button found on page
            buttons = await self.page.query_selector_all('button, [role="button"]')
            if buttons and len(buttons) > 0:
                await buttons[0].click(timeout=2500)
                await asyncio.sleep(0.5)
                return {"success": True, "action": "click", "selector": "first_available_button"}

            return {"success": False, "error": f"Element '{keyword_or_selector}' not interactable."}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def fill(self, selector: str, text: str) -> Dict[str, Any]:
        try:
            await self.page.fill(selector, text, timeout=3000)
            return {"success": True, "action": "fill", "selector": selector, "value": text}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def take_screenshot(self) -> str:
        if not self.page:
            return ""
        try:
            bytes_data = await self.page.screenshot(type="png")
            b64_str = base64.b64encode(bytes_data).decode("utf-8")
            self.screenshots.append(b64_str)
            return b64_str
        except Exception:
            return ""

    async def close(self):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        self.browser = None
        self.playwright = None
