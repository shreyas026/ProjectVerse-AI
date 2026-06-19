from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import get_settings
from app.core.database import connect_db, close_db
from app.api import auth, students, projects, ai, teams, faculty, admin

from fastapi.staticfiles import StaticFiles
import os

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered Academic Innovation Platform",
    lifespan=lifespan,
)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(projects.router)
app.include_router(projects.showcase_router)
app.include_router(ai.router)
app.include_router(teams.router)
app.include_router(faculty.router)
app.include_router(admin.router)


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.app_version, "app": settings.app_name}


@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.app_name} API", "docs": "/docs"}
