from fastapi import APIRouter, Depends
from datetime import datetime
from bson import ObjectId

from app.core.database import (
    faculty_profiles_collection, projects_collection,
    student_profiles_collection, showcases_collection,
    faculty_reviews_collection, project_embeddings_collection
)
from app.api.auth import get_current_faculty, get_current_admin
from app.models.schemas import FacultyProfileCreate

router = APIRouter(prefix="/faculty", tags=["Faculty"])


@router.get("/profile")
async def get_faculty_profile(user=Depends(get_current_faculty)):
    uid = str(user["_id"])
    profile = await faculty_profiles_collection().find_one({"user_id": uid})
    if profile:
        profile["id"] = str(profile["_id"])
        profile.pop("_id", None)
    return profile


@router.put("/profile")
async def update_faculty_profile(data: FacultyProfileCreate, user=Depends(get_current_faculty)):
    uid = str(user["_id"])
    update = data.model_dump()
    update["updated_at"] = datetime.utcnow()
    await faculty_profiles_collection().update_one({"user_id": uid}, {"$set": update}, upsert=True)
    profile = await faculty_profiles_collection().find_one({"user_id": uid})
    profile["id"] = str(profile["_id"])
    profile.pop("_id", None)
    return profile


@router.get("/projects")
async def list_all_projects(limit: int = 50, skip: int = 0, user=Depends(get_current_faculty)):
    cursor = projects_collection().find().sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.post("/analyze-class")
async def analyze_class_projects(project_ids: list[str], user=Depends(get_current_faculty)):
    """Bulk duplicate detection for a class of projects."""
    projects = []
    for pid in project_ids:
        p = await projects_collection().find_one({"_id": ObjectId(pid)})
        if p:
            p["id"] = str(p["_id"])
            p.pop("_id", None)
            projects.append(p)

    try:
        from app.ai.similarity_service import SimilarityService
        svc = SimilarityService()
        report = await svc.bulk_compare(projects)
    except Exception:
        report = [
            {
                "project_id": p["id"],
                "project_title": p["title"],
                "owner_name": p.get("owner_name", ""),
                "similarity_score": 0,
                "duplicate_status": "Unknown",
                "recommendation": "Configure AI for real analysis",
            }
            for p in projects
        ]

    # Persist faculty review
    uid = str(user["_id"])
    await faculty_reviews_collection().insert_one({
        "faculty_id": uid,
        "project_ids": project_ids,
        "report": report,
        "created_at": datetime.utcnow(),
    })
    return {"report": report, "total": len(report)}


@router.get("/reviews")
async def get_faculty_reviews(user=Depends(get_current_faculty)):
    uid = str(user["_id"])
    cursor = faculty_reviews_collection().find({"faculty_id": uid}).sort("created_at", -1).limit(20)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.get("/students")
async def list_students(user=Depends(get_current_faculty)):
    cursor = student_profiles_collection().find().sort("name", 1)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results
