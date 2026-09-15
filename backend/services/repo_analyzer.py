import os
import re
from typing import List, Dict, Any

class RepoAnalyzer:
    def __init__(self, repo_path: str):
        self.repo_path = repo_path

    def analyze_metadata(self) -> Dict[str, Any]:
        """Scans directory and returns metadata summary."""
        file_count = 0
        languages = set()
        frameworks = set()

        if not os.path.exists(self.repo_path):
            return {"file_count": 0, "languages": [], "frameworks": []}

        for root, dirs, files in os.walk(self.repo_path):
            # Exclude node_modules, .git, venv
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'venv', '__pycache__']]
            for f in files:
                file_count += 1
                ext = os.path.splitext(f)[1].lower()
                if ext in ['.js', '.jsx', '.ts', '.tsx']:
                    languages.add('JavaScript/TypeScript')
                elif ext in ['.py']:
                    languages.add('Python')
                elif ext in ['.html']:
                    languages.add('HTML')

                if f == 'package.json':
                    frameworks.add('Node.js / Express / React')
                elif f == 'requirements.txt':
                    frameworks.add('Python / FastAPI / Flask')

        return {
            "file_count": file_count,
            "languages": list(languages),
            "frameworks": list(frameworks)
        }

    def search_code(self, query: str) -> List[Dict[str, Any]]:
        """Searches for query in files and returns matches with snippets."""
        results = []
        if not os.path.exists(self.repo_path):
            return results

        query_regex = re.compile(re.escape(query), re.IGNORECASE)

        for root, dirs, files in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'venv', '__pycache__']]
            for f in files:
                rel_path = os.path.relpath(os.path.join(root, f), self.repo_path)
                full_path = os.path.join(root, f)

                # Skip binary files
                if f.endswith(('.png', '.jpg', '.ico', '.db', '.pdf')):
                    continue

                try:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as file:
                        lines = file.readlines()
                        for idx, line in enumerate(lines):
                            if query_regex.search(line):
                                results.append({
                                    "file": rel_path.replace("\\", "/"),
                                    "line_number": idx + 1,
                                    "line_content": line.strip()
                                })
                except Exception:
                    pass

        return results[:30] # Cap top 30 matches

    def read_file_segment(self, relative_path: str, start_line: int = 1, end_line: int = 200) -> str:
        """Reads specific line range of a file within the repo."""
        full_path = os.path.join(self.repo_path, relative_path)
        if not os.path.exists(full_path):
            return f"Error: File '{relative_path}' not found."

        try:
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                selected = lines[max(0, start_line - 1):end_line]
                return "".join(selected)
        except Exception as e:
            return f"Error reading file: {str(e)}"
