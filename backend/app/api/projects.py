from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from datetime import datetime
from bson import ObjectId
import cloudinary.uploader

from app.core.database import (
    projects_collection, project_embeddings_collection,
    showcases_collection, quality_reports_collection,
    originality_reports_collection, student_profiles_collection
)
from app.api.auth import get_current_student, get_current_user
from app.models.schemas import ProjectCreate, ShowcaseCreate

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/")
async def list_projects(domain: str = None, tech: str = None, limit: int = 20, skip: int = 0):
    query = {"status": {"$ne": "archived"}}
    if domain:
        query["domain"] = domain
    if tech:
        query["tech_stack"] = {"$in": [tech]}
    cursor = projects_collection().find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.post("/", status_code=201)
async def create_project(data: ProjectCreate, user=Depends(get_current_student)):
    uid = str(user["_id"])
    profile = await student_profiles_collection().find_one({"user_id": uid})
    doc = data.model_dump()
    doc.update({
        "owner_id": uid,
        "owner_name": profile["name"] if profile else user["name"],
        "status": "active",
        "quality_score": None,
        "originality_score": None,
        "views": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })
    result = await projects_collection().insert_one(doc)
    project_id = str(result.inserted_id)

    # Update student's project count
    await student_profiles_collection().update_one(
        {"user_id": uid}, {"$inc": {"projects_created": 1}}
    )

    # Queue embedding generation (async)
    try:
        from app.ai.embedding_service import EmbeddingService
        svc = EmbeddingService()
        text = f"{data.title} {data.description} {' '.join(data.tech_stack)}"
        embedding = svc.embed(text)
        await project_embeddings_collection().insert_one({
            "project_id": project_id,
            "vector": embedding.tolist(),
            "model": "all-MiniLM-L6-v2",
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        print(f"Embedding generation skipped: {e}")

    doc["id"] = project_id
    doc.pop("_id", None)
    return doc


@router.get("/{project_id}")
async def get_project(project_id: str):
    project = await projects_collection().find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await projects_collection().update_one({"_id": ObjectId(project_id)}, {"$inc": {"views": 1}})
    project["id"] = str(project["_id"])
    project.pop("_id", None)
    return project


@router.put("/{project_id}")
async def update_project(project_id: str, data: ProjectCreate, user=Depends(get_current_student)):
    uid = str(user["_id"])
    project = await projects_collection().find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project["owner_id"] != uid:
        raise HTTPException(status_code=403, detail="Not your project")

    update = data.model_dump()
    update["updated_at"] = datetime.utcnow()
    await projects_collection().update_one({"_id": ObjectId(project_id)}, {"$set": update})
    return {"message": "Updated"}


@router.delete("/{project_id}")
async def delete_project(project_id: str, user=Depends(get_current_student)):
    uid = str(user["_id"])
    project = await projects_collection().find_one({"_id": ObjectId(project_id)})
    if not project or project["owner_id"] != uid:
        raise HTTPException(status_code=403, detail="Not authorized")
    await projects_collection().delete_one({"_id": ObjectId(project_id)})
    await project_embeddings_collection().delete_one({"project_id": project_id})
    return {"message": "Deleted"}


@router.get("/my/projects")
async def my_projects(user=Depends(get_current_student)):
    uid = str(user["_id"])
    cursor = projects_collection().find({"owner_id": uid}).sort("created_at", -1)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


# ── Showcases ───────────────────────────────────────────────────────────────────
@router.post("/{project_id}/showcase", status_code=201)
async def create_showcase(project_id: str, data: ShowcaseCreate, user=Depends(get_current_student)):
    uid = str(user["_id"])
    project = await projects_collection().find_one({"_id": ObjectId(project_id)})
    if not project or project["owner_id"] != uid:
        raise HTTPException(status_code=403, detail="Not authorized")

    profile = await student_profiles_collection().find_one({"user_id": uid})
    doc = data.model_dump()
    doc.update({
        "project_id": project_id,
        "owner_id": uid,
        "owner_name": profile["name"] if profile else user["name"],
        "project_title": project["title"],
        "screenshots": [],
        "zip_url": None,
        "views": 0,
        "likes": 0,
        "downloads": 0,
        "created_at": datetime.utcnow(),
    })
    result = await showcases_collection().insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


showcase_router = APIRouter(prefix="/showcases", tags=["Showcases"])


@showcase_router.get("/")
async def list_showcases(q: str = None, domain: str = None, limit: int = 20, skip: int = 0):
    query = {}
    if q:
        query["$or"] = [
            {"project_title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"tags": {"$in": [q]}}
        ]
    cursor = showcases_collection().find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@showcase_router.get("/{showcase_id}")
async def get_showcase(showcase_id: str):
    doc = await showcases_collection().find_one({"_id": ObjectId(showcase_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Showcase not found")
    await showcases_collection().update_one({"_id": ObjectId(showcase_id)}, {"$inc": {"views": 1}})
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@showcase_router.post("/{showcase_id}/like")
async def like_showcase(showcase_id: str, user=Depends(get_current_user)):
    await showcases_collection().update_one({"_id": ObjectId(showcase_id)}, {"$inc": {"likes": 1}})
    return {"message": "Liked"}
