from fastapi import APIRouter, Depends
from datetime import datetime
from bson import ObjectId

from app.core.database import (
    users_collection, student_profiles_collection,
    projects_collection, showcases_collection,
    analytics_collection, impact_scores_collection
)
from app.api.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def platform_stats(user=Depends(get_current_admin)):
    total_users = await users_collection().count_documents({})
    total_students = await users_collection().count_documents({"role": "student"})
    total_faculty = await users_collection().count_documents({"role": "faculty"})
    total_projects = await projects_collection().count_documents({})
    total_showcases = await showcases_collection().count_documents({})
    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_projects": total_projects,
        "total_showcases": total_showcases,
    }


@router.get("/users")
async def list_users(role: str = None, limit: int = 50, skip: int = 0, user=Depends(get_current_admin)):
    query = {}
    if role:
        query["role"] = role
    cursor = users_collection().find(query, {"hashed_password": 0}).sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, user=Depends(get_current_admin)):
    await users_collection().delete_one({"_id": ObjectId(user_id)})
    await student_profiles_collection().delete_one({"user_id": user_id})
    return {"message": "User deleted"}


@router.get("/projects")
async def admin_list_projects(limit: int = 50, skip: int = 0, user=Depends(get_current_admin)):
    cursor = projects_collection().find().sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, user=Depends(get_current_admin)):
    await projects_collection().delete_one({"_id": ObjectId(project_id)})
    return {"message": "Project deleted"}


@router.get("/leaderboard")
async def full_leaderboard(limit: int = 50, user=Depends(get_current_admin)):
    cursor = impact_scores_collection().find().sort("overall_score", -1).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results
