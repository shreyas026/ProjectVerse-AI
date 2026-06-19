from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserRole(str, Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    ADMIN = "admin"


class OAuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"
    GITHUB = "github"


# ── Users ──────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: UserRole
    name: str = Field(min_length=2)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    is_verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordReset(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


# ── Student Profile ─────────────────────────────────────────────────────────────
class SkillSet(BaseModel):
    programming_languages: List[str] = []
    frameworks: List[str] = []
    databases: List[str] = []
    ai_skills: List[str] = []
    other: List[str] = []


class SocialLinks(BaseModel):
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None


class StudentProfileCreate(BaseModel):
    name: str
    college: str
    department: str
    year: int = Field(ge=1, le=6)
    bio: Optional[str] = None
    skills: SkillSet = SkillSet()
    links: SocialLinks = SocialLinks()
    interests: List[str] = []


class StudentProfileResponse(StudentProfileCreate):
    id: str
    user_id: str
    resume_url: Optional[str] = None
    avatar_url: Optional[str] = None
    projects_created: int = 0
    projects_joined: int = 0
    created_at: datetime
    updated_at: datetime


# ── Faculty Profile ─────────────────────────────────────────────────────────────
class FacultyProfileCreate(BaseModel):
    name: str
    college: str
    department: str
    designation: str
    bio: Optional[str] = None
    links: SocialLinks = SocialLinks()


class FacultyProfileResponse(FacultyProfileCreate):
    id: str
    user_id: str
    avatar_url: Optional[str] = None
    created_at: datetime


# ── Projects ────────────────────────────────────────────────────────────────────
class ProjectStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ProjectCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=20)
    tech_stack: List[str] = []
    domain: Optional[str] = None
    github_url: Optional[str] = None
    tags: List[str] = []


class ProjectResponse(ProjectCreate):
    id: str
    owner_id: str
    owner_name: str
    status: ProjectStatus
    quality_score: Optional[float] = None
    originality_score: Optional[float] = None
    views: int = 0
    created_at: datetime
    updated_at: datetime


# ── Achievements ────────────────────────────────────────────────────────────────
class AchievementType(str, Enum):
    HACKATHON = "hackathon"
    CERTIFICATION = "certification"
    INTERNSHIP = "internship"
    RESEARCH_PAPER = "research_paper"
    WORKSHOP = "workshop"
    OPEN_SOURCE = "open_source"
    COMPETITION = "competition"
    OTHER = "other"


class AchievementCreate(BaseModel):
    title: str
    description: str
    organization: str
    achievement_type: AchievementType
    date: datetime
    position: Optional[str] = None
    url: Optional[str] = None


class AchievementResponse(AchievementCreate):
    id: str
    student_id: str
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    created_at: datetime


# ── Teams ───────────────────────────────────────────────────────────────────────
class TeamCreate(BaseModel):
    project_id: str
    name: str
    description: Optional[str] = None
    required_skills: List[str] = []
    max_members: int = Field(ge=2, le=10)
    domain: Optional[str] = None


class TeamResponse(TeamCreate):
    id: str
    owner_id: str
    members: List[str] = []
    is_open: bool = True
    created_at: datetime


# ── Tasks ───────────────────────────────────────────────────────────────────────
class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskCreate(BaseModel):
    team_id: str
    title: str
    description: Optional[str] = None
    assignee_id: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str = "medium"


class TaskResponse(TaskCreate):
    id: str
    status: TaskStatus = TaskStatus.TODO
    created_by: str
    created_at: datetime
    updated_at: datetime


# ── Showcase ────────────────────────────────────────────────────────────────────
class ShowcaseCreate(BaseModel):
    project_id: str
    description: str
    features: List[str] = []
    github_url: Optional[str] = None
    deployment_url: Optional[str] = None
    demo_video_url: Optional[str] = None
    tech_stack: List[str] = []
    tags: List[str] = []


class ShowcaseResponse(ShowcaseCreate):
    id: str
    owner_id: str
    owner_name: str
    project_title: str
    screenshots: List[str] = []
    zip_url: Optional[str] = None
    views: int = 0
    likes: int = 0
    downloads: int = 0
    created_at: datetime


# ── Impact Scores ───────────────────────────────────────────────────────────────
class ImpactScoreResponse(BaseModel):
    student_id: str
    technical_score: float = 0
    innovation_score: float = 0
    achievement_score: float = 0
    contribution_score: float = 0
    teamwork_score: float = 0
    overall_score: float = 0
    department_rank: Optional[int] = None
    college_rank: Optional[int] = None
    updated_at: datetime


# ── AI Requests ─────────────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None  # "project_guidance" | "career" | "coding"


class ProjectValidationRequest(BaseModel):
    title: str
    description: str
    tech_stack: List[str] = []


class QualityCheckRequest(BaseModel):
    github_url: Optional[str] = None
    # ZIP uploaded via multipart


class OriginalityCheckRequest(BaseModel):
    text: Optional[str] = None
    # Document uploaded via multipart


class TeamMatchRequest(BaseModel):
    team_id: str
    candidate_id: str


# ── Notifications ───────────────────────────────────────────────────────────────
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    notification_type: str
    title: str
    message: str
    is_read: bool = False
    link: Optional[str] = None
    created_at: datetime
