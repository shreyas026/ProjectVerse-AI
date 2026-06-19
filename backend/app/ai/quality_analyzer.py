import subprocess
import tempfile
import zipfile
import os
import json
from app.ai.llm_service import LLMService


class QualityAnalyzer:
    def __init__(self):
        self.llm = LLMService()

    async def analyze_zip(self, content: bytes) -> dict:
        with tempfile.TemporaryDirectory() as tmpdir:
            zip_path = os.path.join(tmpdir, "project.zip")
            with open(zip_path, "wb") as f:
                f.write(content)
            with zipfile.ZipFile(zip_path, "r") as zf:
                zf.extractall(tmpdir)
            os.remove(zip_path)
            return await self._analyze_directory(tmpdir)

    async def analyze_github(self, github_url: str) -> dict:
        import subprocess
        with tempfile.TemporaryDirectory() as tmpdir:
            result = subprocess.run(
                ["git", "clone", "--depth", "1", github_url, tmpdir],
                capture_output=True, text=True, timeout=60
            )
            if result.returncode != 0:
                return {"error": "Failed to clone repository", "overall_score": 0}
            return await self._analyze_directory(tmpdir)

    async def _analyze_directory(self, path: str) -> dict:
        metrics = {}

        # Pylint
        try:
            r = subprocess.run(
                ["python", "-m", "pylint", path, "--output-format=json", "--score=yes"],
                capture_output=True, text=True, timeout=30
            )
            pylint_data = json.loads(r.stdout) if r.stdout.strip().startswith("[") else []
            errors = len([m for m in pylint_data if m.get("type") == "error"])
            warnings = len([m for m in pylint_data if m.get("type") == "warning"])
            metrics["pylint_errors"] = errors
            metrics["pylint_warnings"] = warnings
            code_score = max(0, 100 - errors * 10 - warnings * 2)
        except Exception:
            code_score = 70
            pylint_data = []

        # Bandit security
        try:
            r = subprocess.run(
                ["python", "-m", "bandit", "-r", path, "-f", "json"],
                capture_output=True, text=True, timeout=30
            )
            bandit_data = json.loads(r.stdout) if r.stdout else {}
            high_issues = len([i for i in bandit_data.get("results", []) if i.get("issue_severity") == "HIGH"])
            security_score = max(0, 100 - high_issues * 20)
        except Exception:
            security_score = 75
            bandit_data = {}

        # README check
        has_readme = any(
            f.lower() == "readme.md" for _, _, files in os.walk(path) for f in files
        )
        has_tests = any(
            "test" in f.lower() for _, _, files in os.walk(path) for f in files
        )
        doc_score = 80 if has_readme else 40
        test_score = 70 if has_tests else 30

        # Overall
        overall = round((code_score * 0.3 + security_score * 0.25 + doc_score * 0.25 + test_score * 0.2), 1)

        # LLM human-readable report
        try:
            summary_prompt = f"""Code quality metrics:
- Code score: {code_score}/100 ({metrics.get('pylint_errors', 0)} errors, {metrics.get('pylint_warnings', 0)} warnings)
- Security score: {security_score}/100
- Documentation score: {doc_score}/100 (README: {'Yes' if has_readme else 'No'})
- Testing score: {test_score}/100 (Tests found: {'Yes' if has_tests else 'No'})

Provide 3-5 specific improvement suggestions as a JSON list under key "suggestions"."""
            llm_result = await self.llm.generate("You are a code quality expert.", summary_prompt, 512)
            import re
            match = re.search(r'\[.*?\]', llm_result, re.DOTALL)
            suggestions = json.loads(match.group()) if match else []
        except Exception:
            suggestions = [
                "Add comprehensive unit tests to improve test coverage",
                "Move secrets to environment variables",
                "Add type hints to improve code clarity",
            ]

        return {
            "overall_score": overall,
            "code_score": code_score,
            "documentation_score": doc_score,
            "security_score": security_score,
            "testing_score": test_score,
            "has_readme": has_readme,
            "has_tests": has_tests,
            "suggestions": suggestions,
            "issues": [
                {"severity": "error", "message": f"{metrics.get('pylint_errors', 0)} pylint errors found"},
                {"severity": "warning", "message": f"{metrics.get('pylint_warnings', 0)} pylint warnings found"},
            ],
        }
