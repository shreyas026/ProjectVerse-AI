from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
import httpx
from bson import ObjectId

from app.core.database import users_collection, student_profiles_collection, faculty_profiles_collection, notifications_collection
from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
    create_email_verification_token, create_password_reset_token
)
from app.core.config import get_settings
from app.models.schemas import UserCreate, UserLogin, PasswordResetRequest, PasswordReset, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()
security = HTTPBearer()


def user_to_response(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        role=user["role"],
        is_verified=user.get("is_verified", False),
        avatar_url=user.get("avatar_url"),
        created_at=user.get("created_at", datetime.utcnow())
    )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await users_collection().find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def get_current_student(user=Depends(get_current_user)):
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access required")
    return user


async def get_current_faculty(user=Depends(get_current_user)):
    if user["role"] != "faculty":
        raise HTTPException(status_code=403, detail="Faculty access required")
    return user


async def get_current_admin(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


@router.post("/register", status_code=201)
async def register(data: UserCreate, background_tasks: BackgroundTasks):
    users = users_collection()
    existing = await users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user_doc = {
        "email": data.email,
        "name": data.name,
        "role": data.role,
        "hashed_password": hash_password(data.password),
        "is_verified": True,  # Auto-verify in dev; use email flow in prod
        "oauth_provider": "local",
        "avatar_url": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Create empty profile
    if data.role == "student":
        await student_profiles_collection().insert_one({
            "user_id": user_id,
            "name": data.name,
            "college": "",
            "department": "",
            "year": 1,
            "bio": "",
            "skills": {"programming_languages": [], "frameworks": [], "databases": [], "ai_skills": [], "other": []},
            "links": {"github": None, "linkedin": None, "portfolio": None},
            "interests": [],
            "resume_url": None,
            "avatar_url": None,
            "projects_created": 0,
            "projects_joined": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        })
    elif data.role == "faculty":
        await faculty_profiles_collection().insert_one({
            "user_id": user_id,
            "name": data.name,
            "college": "",
            "department": "",
            "designation": "",
            "bio": "",
            "links": {"github": None, "linkedin": None, "portfolio": None},
            "avatar_url": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        })

    user_doc["_id"] = result.inserted_id
    access_token = create_access_token({"sub": user_id, "role": data.role})
    refresh_token = create_refresh_token({"sub": user_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user_to_response(user_doc)
    }


@router.post("/login")
async def login(data: UserLogin):
    user = await users_collection().find_one({"email": data.email})
    if not user or not verify_password(data.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    access_token = create_access_token({"sub": user_id, "role": user["role"]})
    refresh_token = create_refresh_token({"sub": user_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user_to_response(user)
    }


@router.post("/refresh")
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=400, detail="Not a refresh token")
    user_id = payload.get("sub")
    user = await users_collection().find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access_token = create_access_token({"sub": user_id, "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return user_to_response(user)


@router.post("/forgot-password")
async def forgot_password(data: PasswordResetRequest):
    user = await users_collection().find_one({"email": data.email})
    if not user:
        return {"message": "If this email exists, a reset link has been sent"}
    # In prod: send email via Resend
    token = create_password_reset_token(data.email)
    return {"message": "Reset link sent", "token": token}  # Remove token from prod response


@router.post("/reset-password")
async def reset_password(data: PasswordReset):
    payload = decode_token(data.token)
    if payload.get("type") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid reset token")
    email = payload.get("email")
    await users_collection().update_one(
        {"email": email},
        {"$set": {"hashed_password": hash_password(data.new_password), "updated_at": datetime.utcnow()}}
    )
    return {"message": "Password reset successfully"}


@router.post("/github")
async def github_oauth(code: str):
    """Exchange GitHub OAuth code for user data"""
    if not settings.github_client_id:
        raise HTTPException(status_code=503, detail="GitHub OAuth not configured")
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            data={"client_id": settings.github_client_id, "client_secret": settings.github_client_secret, "code": code},
            headers={"Accept": "application/json"}
        )
        access_token = token_res.json().get("access_token")
        user_res = await client.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}"})
        gh_user = user_res.json()

    email = gh_user.get("email") or f"{gh_user['login']}@github.noemail"
    user = await users_collection().find_one({"email": email})
    if not user:
        result = await users_collection().insert_one({
            "email": email, "name": gh_user.get("name", gh_user["login"]),
            "role": "student", "hashed_password": "", "is_verified": True,
            "oauth_provider": "github", "avatar_url": gh_user.get("avatar_url"),
            "created_at": datetime.utcnow(), "updated_at": datetime.utcnow(),
        })
        user = await users_collection().find_one({"_id": result.inserted_id})

    uid = str(user["_id"])
    return {
        "access_token": create_access_token({"sub": uid, "role": user["role"]}),
        "refresh_token": create_refresh_token({"sub": uid}),
        "token_type": "bearer",
        "user": user_to_response(user)
    }
