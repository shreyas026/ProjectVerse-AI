import numpy as np
from app.ai.embedding_service import EmbeddingService
from app.core.database import projects_collection


class OriginalityChecker:
    def __init__(self):
        self.embed_svc = EmbeddingService()

    async def check_text(self, text: str) -> dict:
        query_vec = self.embed_svc.embed(text)
        matches = []
        async for doc in projects_collection().find({}, {"title": 1, "description": 1, "owner_name": 1}):
            stored_text = f"{doc['title']} {doc['description']}"
            stored_vec = self.embed_svc.embed(stored_text)
            sim = float(np.dot(query_vec, stored_vec))
            if sim > 0.4:
                matches.append({
                    "project_id": str(doc["_id"]),
                    "title": doc["title"],
                    "author": doc.get("owner_name", ""),
                    "similarity": round(sim * 100, 1),
                })
        matches.sort(key=lambda x: x["similarity"], reverse=True)
        top = matches[:5]
        max_sim = top[0]["similarity"] if top else 0
        originality = round(100 - max_sim, 1)
        verdict = (
            "Highly Original" if originality > 80 else
            "Mostly Original" if originality > 60 else
            "Partially Similar" if originality > 40 else
            "High Similarity Detected"
        )
        return {
            "originality_score": originality,
            "similarity_percentage": max_sim,
            "matched_projects": top,
            "verdict": verdict,
        }

    async def check_document(self, content: bytes, filename: str) -> dict:
        text = ""
        if filename and filename.lower().endswith(".pdf"):
            try:
                import io
                from PyPDF2 import PdfReader
                reader = PdfReader(io.BytesIO(content))
                for page in reader.pages:
                    text += page.extract_text() or ""
            except Exception:
                text = content.decode("utf-8", errors="ignore")
        else:
            text = content.decode("utf-8", errors="ignore")
        return await self.check_text(text[:2000])  # Limit for embedding


class AchievementAnalyzer:
    async def analyze(self, achievements: list) -> dict:
        from app.ai.llm_service import LLMService
        llm = LLMService()
        return await llm.analyze_achievements_text(achievements)


class TeamMatcher:
    def __init__(self):
        self.embed_svc = EmbeddingService()

    async def find_matches(self, team: dict) -> list:
        from app.core.database import student_profiles_collection, impact_scores_collection
        required_skills = " ".join(team.get("required_skills", []))
        team_vec = self.embed_svc.embed(required_skills)

        candidates = []
        async for profile in student_profiles_collection().find({"user_id": {"$nin": team.get("members", [])}}):
            skills = profile.get("skills", {})
            all_skills = " ".join(
                skills.get("programming_languages", []) +
                skills.get("frameworks", []) +
                skills.get("ai_skills", [])
            )
            if not all_skills.strip():
                continue
            student_vec = self.embed_svc.embed(all_skills)
            sim = float(np.dot(team_vec, student_vec))
            scores = await impact_scores_collection().find_one({"student_id": profile["user_id"]})
            overall = scores.get("overall_score", 0) if scores else 0
            match = round((sim * 0.6 + overall / 100 * 0.4) * 100, 1)
            candidates.append({
                "student_id": profile["user_id"],
                "name": profile["name"],
                "match_score": match,
                "skills": all_skills[:100],
                "impact_score": overall,
                "reason": f"Strong skill alignment ({round(sim * 100)}%) and impact score {overall}",
            })
        return sorted(candidates, key=lambda x: x["match_score"], reverse=True)[:10]
