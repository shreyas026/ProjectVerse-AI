from groq import Groq
from app.core.config import get_settings

settings = get_settings()


class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.groq_model

    async def generate(self, system: str, user_prompt: str, max_tokens: int = 1024) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return response.choices[0].message.content

    async def get_improvement_suggestions(self, title: str, description: str, tech_stack: list) -> dict:
        system = (
            "You are an expert software architect and AI researcher. "
            "Analyze the given project and provide structured improvement suggestions."
        )
        prompt = f"""Project: {title}
Description: {description}
Tech Stack: {', '.join(tech_stack)}

Provide JSON with keys:
- limitations (list of 3-5 current limitations)
- improvements (list of 3-5 feature improvements)
- innovation_opportunities (list of 2-3 AI/research extensions)
- security_issues (list of potential security concerns)
- scalability_suggestions (list of scalability improvements)"""

        import json
        text = await self.generate(system, prompt)
        try:
            start = text.find("{")
            end = text.rfind("}") + 1
            return json.loads(text[start:end])
        except Exception:
            return {
                "limitations": ["Limited scalability", "No caching layer", "Missing API documentation"],
                "improvements": ["Add Redis caching", "Implement microservices", "Add CI/CD"],
                "innovation_opportunities": ["ML-powered analytics", "Real-time collaboration"],
                "security_issues": ["Check for hardcoded credentials", "Add rate limiting"],
                "scalability_suggestions": ["Use message queue", "Implement horizontal scaling"],
            }

    async def analyze_achievements_text(self, achievements: list) -> dict:
        system = "You are an academic achievement evaluator. Score achievements across dimensions."
        ach_text = "\n".join([f"- {a.get('title')} ({a.get('achievement_type')}): {a.get('description', '')}" for a in achievements])
        prompt = f"""Achievements:\n{ach_text}\n\nReturn JSON with:
- technical_score (0-100)
- leadership_score (0-100)
- innovation_score (0-100)
- achievement_score (0-100)
- summary (brief explanation)"""
        import json
        text = await self.generate(system, prompt)
        try:
            start = text.find("{")
            end = text.rfind("}") + 1
            return json.loads(text[start:end])
        except Exception:
            n = len(achievements)
            return {
                "technical_score": min(n * 18, 100),
                "leadership_score": min(n * 15, 100),
                "innovation_score": min(n * 20, 100),
                "achievement_score": min(n * 16, 100),
                "summary": "Score computed from achievement count."
            }
