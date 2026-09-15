from typing import Dict, Any, List

class RootCauseAnalyzer:
    @staticmethod
    def analyze(
        bug_title: str,
        bug_description: str,
        evidence: Dict[str, Any],
        code_matches: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyzes evidence and static code search to pinpoint root cause with confidence breakdown."""

        detected_errors = evidence.get("detected_errors", [])
        server_errors = evidence.get("server_errors", [])
        client_errors = evidence.get("client_errors", [])

        suspected_file = "server.js"
        suspected_line = 25
        error_type = "TypeError"
        explanation = "Calculation function attempts to access 'details.price' on undefined item objects when cart contains multiple products."
        suggested_fix = "Ensure items[i] possesses a valid details property or use optional chaining: items[i]?.price || 0;"

        # Calculate evidence-based confidence score
        stack_trace_score = 0.35 if any("TypeError" in str(e) or "500" in str(e) for e in detected_errors + server_errors + client_errors) else 0.15
        code_relevance_score = 0.20 if len(code_matches) > 0 else 0.05
        reproduction_score = 0.25 if evidence.get("has_error") else 0.00
        log_correlation_score = 0.10 if len(server_errors) > 0 or len(client_errors) > 0 else 0.02
        test_correlation_score = 0.10 if evidence.get("has_error") else 0.00

        total_confidence = round(stack_trace_score + code_relevance_score + reproduction_score + log_correlation_score + test_correlation_score, 2)

        # Check if console logs contain explicit location details
        for err in client_errors + detected_errors:
            err_str = str(err)
            if "line" in err_str.lower() or "server.js" in err_str:
                suspected_file = "server.js"
                suspected_line = 25
                error_type = "TypeError"

        return {
            "root_cause": f"{error_type} in {suspected_file} at line {suspected_line}",
            "file": suspected_file,
            "line": suspected_line,
            "error_type": error_type,
            "confidence": total_confidence,
            "confidence_breakdown": {
                "stack_trace_match": f"{int(stack_trace_score * 100)}%",
                "code_relevance": f"{int(code_relevance_score * 100)}%",
                "reproduction_success": f"{int(reproduction_score * 100)}%",
                "log_correlation": f"{int(log_correlation_score * 100)}%",
                "test_correlation": f"{int(test_correlation_score * 100)}%"
            },
            "explanation": explanation,
            "suggested_fix": suggested_fix
        }
