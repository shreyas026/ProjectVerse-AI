from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from datetime import datetime
from bson import ObjectId
import cloudinary
import cloudinary.uploader

from app.core.database import (
    student_profiles_collection, achievements_collection,
    achievement_scores_collection, impact_scores_collection
)
from app.api.auth import get_current_student, get_current_user
from app.models.schemas import StudentProfileCreate, AchievementCreate
from app.core.config import get_settings

router = APIRouter(prefix="/students", tags=["Students"])
settings = get_settings()


@router.get("/profile")
async def get_profile(user=Depends(get_current_student)):
    profile = await student_profiles_collection().find_one({"user_id": str(user["_id"])})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile["id"] = str(profile["_id"])
    profile.pop("_id", None)
    return profile


@router.put("/profile")
async def update_profile(data: StudentProfileCreate, user=Depends(get_current_student)):
    uid = str(user["_id"])
    update = data.model_dump()
    update["updated_at"] = datetime.utcnow()
    result = await student_profiles_collection().update_one(
        {"user_id": uid},
        {"$set": update},
        upsert=True
    )
    profile = await student_profiles_collection().find_one({"user_id": uid})
    profile["id"] = str(profile["_id"])
    profile.pop("_id", None)
    return profile


@router.post("/profile/avatar")
async def upload_avatar(file: UploadFile = File(...), user=Depends(get_current_student)):
    uid = str(user["_id"])
    contents = await file.read()
    try:
        result = cloudinary.uploader.upload(
            contents,
            folder=f"projectverse/avatars/{uid}",
            resource_type="image"
        )
        url = result["secure_url"]
    except Exception:
        # Fallback: save locally
        from app.utils.storage import save_file_locally
        url = save_file_locally(contents, file.filename, "avatars")

    await student_profiles_collection().update_one(
        {"user_id": uid},
        {"$set": {"avatar_url": url, "updated_at": datetime.utcnow()}}
    )
    return {"avatar_url": url}


@router.post("/profile/resume")
async def upload_resume(file: UploadFile = File(...), user=Depends(get_current_student)):
    uid = str(user["_id"])
    contents = await file.read()
    try:
        result = cloudinary.uploader.upload(
            contents,
            folder=f"projectverse/resumes/{uid}",
            resource_type="raw",
            format="pdf"
        )
        url = result["secure_url"]
    except Exception:
        # Fallback: save locally
        from app.utils.storage import save_file_locally
        url = save_file_locally(contents, file.filename, "resumes")

    await student_profiles_collection().update_one(
        {"user_id": uid},
        {"$set": {"resume_url": url, "updated_at": datetime.utcnow()}}
    )
    return {"resume_url": url}


# ── Achievements ────────────────────────────────────────────────────────────────
@router.get("/achievements")
async def list_achievements(user=Depends(get_current_student)):
    uid = str(user["_id"])
    cursor = achievements_collection().find({"student_id": uid}).sort("date", -1)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.post("/achievements", status_code=201)
async def create_achievement(data: AchievementCreate, user=Depends(get_current_student)):
    uid = str(user["_id"])
    doc = data.model_dump()
    doc["student_id"] = uid
    doc["image_url"] = None
    doc["pdf_url"] = None
    doc["created_at"] = datetime.utcnow()
    result = await achievements_collection().insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.post("/achievements/{achievement_id}/upload")
async def upload_achievement_file(
    achievement_id: str,
    file: UploadFile = File(...),
    file_type: str = "image",
    user=Depends(get_current_student)
):
    uid = str(user["_id"])
    achievement = await achievements_collection().find_one({"_id": ObjectId(achievement_id), "student_id": uid})
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")

    contents = await file.read()
    try:
        res_type = "image" if file_type == "image" else "raw"
        result = cloudinary.uploader.upload(
            contents,
            folder=f"projectverse/achievements/{uid}",
            resource_type=res_type
        )
        url = result["secure_url"]
    except Exception:
        # Fallback: save locally
        from app.utils.storage import save_file_locally
        url = save_file_locally(contents, file.filename, "achievements")

    field = "image_url" if file_type == "image" else "pdf_url"
    await achievements_collection().update_one(
        {"_id": ObjectId(achievement_id)},
        {"$set": {field: url}}
    )
    return {field: url}


@router.delete("/achievements/{achievement_id}")
async def delete_achievement(achievement_id: str, user=Depends(get_current_student)):
    uid = str(user["_id"])
    result = await achievements_collection().delete_one({"_id": ObjectId(achievement_id), "student_id": uid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return {"message": "Deleted"}


# ── Scores & Rankings ───────────────────────────────────────────────────────────
@router.get("/scores")
async def get_scores(user=Depends(get_current_student)):
    uid = str(user["_id"])
    score = await impact_scores_collection().find_one({"student_id": uid})
    if not score:
        return {
            "student_id": uid,
            "technical_score": 0,
            "innovation_score": 0,
            "achievement_score": 0,
            "contribution_score": 0,
            "teamwork_score": 0,
            "overall_score": 0,
        }
    score["id"] = str(score["_id"])
    score.pop("_id", None)
    return score


@router.get("/leaderboard")
async def get_leaderboard(limit: int = 20):
    cursor = impact_scores_collection().find().sort("overall_score", -1).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.get("/{student_id}/public")
async def get_public_profile(student_id: str):
    """Public profile view (no auth required)"""
    profile = await student_profiles_collection().find_one({"user_id": student_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Student not found")
    profile["id"] = str(profile["_id"])
    profile.pop("_id", None)

    achievements = []
    cursor = achievements_collection().find({"student_id": student_id})
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        achievements.append(doc)

    scores = await impact_scores_collection().find_one({"student_id": student_id})
    if scores:
        scores["id"] = str(scores["_id"])
        scores.pop("_id", None)

    return {"profile": profile, "achievements": achievements, "scores": scores}
