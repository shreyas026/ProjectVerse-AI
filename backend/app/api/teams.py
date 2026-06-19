from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from datetime import datetime
from bson import ObjectId
from typing import List, Dict
import json

from app.core.database import (
    teams_collection, team_requests_collection, tasks_collection,
    messages_collection, student_profiles_collection,
    impact_scores_collection
)
from app.api.auth import get_current_user, get_current_student
from app.models.schemas import TeamCreate, TaskCreate

router = APIRouter(prefix="/teams", tags=["Teams"])


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, team_id: str):
        await websocket.accept()
        self.active_connections.setdefault(team_id, []).append(websocket)

    def disconnect(self, websocket: WebSocket, team_id: str):
        if team_id in self.active_connections:
            self.active_connections[team_id].remove(websocket)

    async def broadcast(self, message: dict, team_id: str):
        for ws in self.active_connections.get(team_id, []):
            try:
                await ws.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


@router.get("/")
async def list_open_teams(domain: str = None, limit: int = 20, skip: int = 0):
    query = {"is_open": True}
    if domain:
        query["domain"] = domain
    cursor = teams_collection().find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.post("/", status_code=201)
async def create_team(data: TeamCreate, user=Depends(get_current_student)):
    uid = str(user["_id"])
    profile = await student_profiles_collection().find_one({"user_id": uid})
    doc = data.model_dump()
    doc.update({
        "owner_id": uid,
        "owner_name": profile["name"] if profile else user["name"],
        "members": [uid],
        "is_open": True,
        "created_at": datetime.utcnow(),
    })
    result = await teams_collection().insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.get("/my")
async def my_teams(user=Depends(get_current_student)):
    uid = str(user["_id"])
    cursor = teams_collection().find({"$or": [{"owner_id": uid}, {"members": uid}]})
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.get("/{team_id}")
async def get_team(team_id: str):
    team = await teams_collection().find_one({"_id": ObjectId(team_id)})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team["id"] = str(team["_id"])
    team.pop("_id", None)
    return team


@router.post("/{team_id}/apply")
async def apply_to_team(team_id: str, message: str = "", user=Depends(get_current_student)):
    uid = str(user["_id"])
    team = await teams_collection().find_one({"_id": ObjectId(team_id)})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    if uid in team.get("members", []):
        raise HTTPException(status_code=400, detail="Already a member")
    existing = await team_requests_collection().find_one({"team_id": team_id, "applicant_id": uid})
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")

    profile = await student_profiles_collection().find_one({"user_id": uid})
    scores = await impact_scores_collection().find_one({"student_id": uid})
    doc = {
        "team_id": team_id,
        "applicant_id": uid,
        "applicant_name": profile["name"] if profile else user["name"],
        "message": message,
        "status": "pending",
        "match_score": scores.get("overall_score", 0) if scores else 0,
        "created_at": datetime.utcnow(),
    }
    result = await team_requests_collection().insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.get("/{team_id}/requests")
async def get_team_requests(team_id: str, user=Depends(get_current_student)):
    uid = str(user["_id"])
    team = await teams_collection().find_one({"_id": ObjectId(team_id)})
    if not team or team["owner_id"] != uid:
        raise HTTPException(status_code=403, detail="Not authorized")
    cursor = team_requests_collection().find({"team_id": team_id, "status": "pending"})
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.post("/{team_id}/requests/{request_id}/accept")
async def accept_request(team_id: str, request_id: str, user=Depends(get_current_student)):
    uid = str(user["_id"])
    team = await teams_collection().find_one({"_id": ObjectId(team_id)})
    if not team or team["owner_id"] != uid:
        raise HTTPException(status_code=403, detail="Not authorized")
    req = await team_requests_collection().find_one({"_id": ObjectId(request_id)})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    await teams_collection().update_one({"_id": ObjectId(team_id)}, {"$addToSet": {"members": req["applicant_id"]}})
    await team_requests_collection().update_one({"_id": ObjectId(request_id)}, {"$set": {"status": "accepted"}})
    await student_profiles_collection().update_one({"user_id": req["applicant_id"]}, {"$inc": {"projects_joined": 1}})
    return {"message": "Member added"}


@router.post("/{team_id}/requests/{request_id}/reject")
async def reject_request(team_id: str, request_id: str, user=Depends(get_current_student)):
    uid = str(user["_id"])
    team = await teams_collection().find_one({"_id": ObjectId(team_id)})
    if not team or team["owner_id"] != uid:
        raise HTTPException(status_code=403, detail="Not authorized")
    await team_requests_collection().update_one({"_id": ObjectId(request_id)}, {"$set": {"status": "rejected"}})
    return {"message": "Rejected"}


@router.get("/{team_id}/tasks")
async def get_tasks(team_id: str, user=Depends(get_current_user)):
    cursor = tasks_collection().find({"team_id": team_id}).sort("created_at", 1)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return results


@router.post("/{team_id}/tasks", status_code=201)
async def create_task(team_id: str, data: TaskCreate, user=Depends(get_current_student)):
    uid = str(user["_id"])
    doc = data.model_dump()
    doc.update({
        "team_id": team_id, "status": "todo",
        "created_by": uid,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })
    result = await tasks_collection().insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.patch("/{team_id}/tasks/{task_id}/status")
async def update_task_status(team_id: str, task_id: str, status: str, user=Depends(get_current_student)):
    if status not in ["todo", "in_progress", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    await tasks_collection().update_one(
        {"_id": ObjectId(task_id), "team_id": team_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    return {"message": "Updated"}


@router.delete("/{team_id}/tasks/{task_id}")
async def delete_task(team_id: str, task_id: str, user=Depends(get_current_student)):
    await tasks_collection().delete_one({"_id": ObjectId(task_id), "team_id": team_id})
    return {"message": "Deleted"}


@router.get("/{team_id}/messages")
async def get_messages(team_id: str, limit: int = 50, user=Depends(get_current_user)):
    cursor = messages_collection().find({"team_id": team_id}).sort("timestamp", -1).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)
    return list(reversed(results))


@router.websocket("/{team_id}/ws")
async def websocket_chat(websocket: WebSocket, team_id: str):
    await manager.connect(websocket, team_id)
    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            message_doc = {
                "team_id": team_id,
                "sender_id": data.get("sender_id"),
                "sender_name": data.get("sender_name"),
                "content": data.get("content"),
                "message_type": data.get("message_type", "text"),
                "timestamp": datetime.utcnow().isoformat(),
            }
            await messages_collection().insert_one({**message_doc})
            await manager.broadcast(message_doc, team_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, team_id)


@router.get("/{team_id}/contributions")
async def get_contributions(team_id: str, user=Depends(get_current_user)):
    team = await teams_collection().find_one({"_id": ObjectId(team_id)})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    member_ids = team.get("members", [])
    total_tasks = await tasks_collection().count_documents({"team_id": team_id, "status": "completed"})
    total_messages = await messages_collection().count_documents({"team_id": team_id})
    contributions = []
    for mid in member_ids:
        profile = await student_profiles_collection().find_one({"user_id": mid})
        mt = await tasks_collection().count_documents({"team_id": team_id, "assignee_id": mid, "status": "completed"})
        mm = await messages_collection().count_documents({"team_id": team_id, "sender_id": mid})
        tp = round((mt / max(total_tasks, 1)) * 100, 1)
        mp = round((mm / max(total_messages, 1)) * 100, 1)
        cp = round(tp * 0.7 + mp * 0.3, 1)
        contributions.append({
            "member_id": mid,
            "member_name": profile["name"] if profile else mid,
            "tasks_completed": mt,
            "messages_sent": mm,
            "contribution_percentage": cp,
        })
    return {"team_id": team_id, "contributions": contributions}
