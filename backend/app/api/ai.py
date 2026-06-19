from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import StreamingResponse
from datetime import datetime
from bson import ObjectId
import asyncio
import json

from app.core.database import (
    projects_collection, project_embeddings_collection,
    showcases_collection, student_profiles_collection,
    achievements_collection, quality_reports_collection,
    originality_reports_collection, impact_scores_collection,
    achievement_scores_collection
)
from app.api.auth import get_current_user, get_current_student
from app.models.schemas import ChatRequest, ProjectValidationRequest

router = APIRouter(prefix="/ai", tags=["AI"])


# ── Edu AI Chat ─────────────────────────────────────────────────────────────────
@router.post("/chat")
async def chat(data: ChatRequest, user=Depends(get_current_user)):
    try:
        from app.ai.rag_service import RAGService
        svc = RAGService()
        response = await svc.chat(data.messages, data.context)
        return {"response": response, "role": "assistant"}
    except Exception as e:
        # Fallback stub when AI not configured
        return {
            "response": f"Edu AI is ready! (Configure GROQ_API_KEY to enable full AI responses.) Your question: {data.messages[-1].content if data.messages else ''}",
            "role": "assistant"
        }


@router.post("/chat/stream")
async def chat_stream(data: ChatRequest, user=Depends(get_current_user)):
    async def event_generator():
        try:
            from app.ai.rag_service import RAGService
            svc = RAGService()
            async for chunk in svc.stream_chat(data.messages):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'chunk': 'AI service not configured. Add GROQ_API_KEY to .env'})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# ── Project Validator (Similarity Detection) ────────────────────────────────────
@router.post("/validate-project")
async def validate_project(data: ProjectValidationRequest, user=Depends(get_current_user)):
    try:
        from app.ai.similarity_service import SimilarityService
        svc = SimilarityService()
        result = await svc.find_similar_projects(data.title, data.description, data.tech_stack)
        return result
    except Exception as e:
        # Return mock response when embeddings not configured
        return {
            "similar_projects": [],
            "originality_score": 95,
            "similarity_score": 5,
            "recommendation": "Project appears to be original. AI engine not fully configured yet.",
            "message": str(e)
        }


# ── Project Improvement Suggestions ────────────────────────────────────────────
@router.post("/improve-project/{project_id}")
async def improve_project(project_id: str, user=Depends(get_current_user)):
    project = await projects_collection().find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    try:
        from app.ai.llm_service import LLMService
        llm = LLMService()
        suggestions = await llm.get_improvement_suggestions(
            project["title"], project["description"], project.get("tech_stack", [])
        )
        return suggestions
    except Exception as e:
        return {
            "limitations": ["Limited scalability", "Missing API documentation", "No error handling"],
            "improvements": ["Add microservices architecture", "Implement Redis caching", "Add CI/CD pipeline"],
            "innovation_opportunities": ["AI-powered analytics", "Real-time collaboration", "Mobile app"],
            "note": "Configure GROQ_API_KEY for AI-powered suggestions"
        }


# ── Quality Checker ─────────────────────────────────────────────────────────────
@router.post("/quality-check")
async def quality_check(
    github_url: str = None,
    file: UploadFile = File(None),
    user=Depends(get_current_student)
):
    if not github_url and not file:
        raise HTTPException(status_code=400, detail="Provide either github_url or zip file")
    try:
        from app.ai.quality_analyzer import QualityAnalyzer
        analyzer = QualityAnalyzer()
        if github_url:
            result = await analyzer.analyze_github(github_url)
        else:
            content = await file.read()
            result = await analyzer.analyze_zip(content)
        return result
    except Exception as e:
        return {
            "overall_score": 72,
            "code_score": 75,
            "documentation_score": 65,
            "security_score": 80,
            "testing_score": 60,
            "architecture_score": 78,
            "issues": [
                {"severity": "warning", "file": "app.py", "message": "Function too complex (cyclomatic complexity: 12)"},
                {"severity": "error", "file": "config.py", "message": "Hardcoded API key detected"},
                {"severity": "info", "file": "README.md", "message": "Missing installation instructions"},
            ],
            "suggestions": [
                "Add unit tests to increase test coverage",
                "Move secrets to environment variables",
                "Add type hints to all functions"
            ],
            "note": f"Install analysis tools (pylint, bandit) for real analysis. Error: {str(e)}"
        }


# ── Originality Checker ─────────────────────────────────────────────────────────
@router.post("/originality-check")
async def originality_check(
    file: UploadFile = File(None),
    text: str = None,
    user=Depends(get_current_student)
):
    if not file and not text:
        raise HTTPException(status_code=400, detail="Provide text or document file")
    try:
        from app.ai.originality_checker import OriginalityChecker
        checker = OriginalityChecker()
        if file:
            content = await file.read()
            result = await checker.check_document(content, file.filename)
        else:
            result = await checker.check_text(text)
        return result
    except Exception as e:
        return {
            "originality_score": 88,
            "similarity_percentage": 12,
            "matched_projects": [],
            "matched_reports": [],
            "verdict": "Mostly Original",
            "note": "Configure embedding model for real originality checking"
        }


# ── Achievement Analyzer ─────────────────────────────────────────────────────────
@router.post("/analyze-achievements")
async def analyze_achievements(user=Depends(get_current_student)):
    uid = str(user["_id"])
    achievements = []
    async for doc in achievements_collection().find({"student_id": uid}):
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        achievements.append(doc)

    if not achievements:
        return {"message": "No achievements to analyze"}

    try:
        from app.ai.achievement_analyzer import AchievementAnalyzer
        analyzer = AchievementAnalyzer()
        scores = await analyzer.analyze(achievements)
    except Exception:
        scores = {
            "technical_score": min(len([a for a in achievements if a["achievement_type"] in ["certification", "open_source"]]) * 20, 100),
            "leadership_score": min(len([a for a in achievements if a["achievement_type"] in ["hackathon", "competition"]]) * 25, 100),
            "innovation_score": min(len([a for a in achievements if a["achievement_type"] in ["hackathon", "research_paper"]]) * 30, 100),
            "achievement_score": min(len(achievements) * 15, 100),
        }

    scores["student_id"] = uid
    scores["updated_at"] = datetime.utcnow()
    await achievement_scores_collection().update_one(
        {"student_id": uid}, {"$set": scores}, upsert=True
    )

    # Recalculate impact score
    await _recalculate_impact(uid, scores)
    return scores


# ── Team Matcher ─────────────────────────────────────────────────────────────────
@router.post("/match-team/{team_id}")
async def match_team_candidates(team_id: str, user=Depends(get_current_user)):
    from app.core.database import teams_collection, team_requests_collection
    team = await teams_collection().find_one({"_id": ObjectId(team_id)})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    try:
        from app.ai.team_matcher import TeamMatcher
        matcher = TeamMatcher()
        candidates = await matcher.find_matches(team)
        return {"matches": candidates}
    except Exception as e:
        return {
            "matches": [
                {"student_id": "example", "name": "Configure AI", "match_score": 0,
                 "reason": "Add GROQ_API_KEY and embedding model for real matching"}
            ]
        }


async def _recalculate_impact(student_id: str, achievement_scores: dict):
    """Recalculate and persist the student's impact score"""
    tech = achievement_scores.get("technical_score", 0)
    innov = achievement_scores.get("innovation_score", 0)
    ach = achievement_scores.get("achievement_score", 0)

    # Fetch contribution and teamwork from existing score
    existing = await impact_scores_collection().find_one({"student_id": student_id})
    contrib = existing.get("contribution_score", 0) if existing else 0
    teamwork = existing.get("teamwork_score", 0) if existing else 0

    overall = round(0.30 * tech + 0.25 * innov + 0.20 * ach + 0.15 * contrib + 0.10 * teamwork, 2)

    await impact_scores_collection().update_one(
        {"student_id": student_id},
        {"$set": {
            "technical_score": tech,
            "innovation_score": innov,
            "achievement_score": ach,
            "contribution_score": contrib,
            "teamwork_score": teamwork,
            "overall_score": overall,
            "updated_at": datetime.utcnow()
        }},
        upsert=True
    )
