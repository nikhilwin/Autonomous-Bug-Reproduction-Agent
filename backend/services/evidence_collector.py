from typing import Dict, Any, List

class EvidenceCollector:
    @staticmethod
    def format_evidence(
        console_logs: List[Dict[str, Any]],
        network_logs: List[Dict[str, Any]],
        screenshots: List[str],
        trajectory: List[Dict[str, Any]],
        detected_errors: List[str]
    ) -> Dict[str, Any]:
        """Packages all execution signals into an evidence payload."""
        
        server_errors = [log for log in network_logs if log.get("status", 0) >= 500]
        client_errors = [log for log in console_logs if log.get("type") in ["error", "warning"]]

        return {
            "has_error": len(server_errors) > 0 or len(detected_errors) > 0,
            "detected_errors": detected_errors,
            "server_errors": server_errors,
            "client_errors": client_errors,
            "total_network_failures": len(network_logs),
            "total_console_errors": len(client_errors),
            "screenshots_count": len(screenshots),
            "latest_screenshot_b64": screenshots[-1] if len(screenshots) > 0 else None,
            "action_history": [step.get("action") for step in trajectory if "action" in step]
        }
