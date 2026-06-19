// ── User & Auth ──────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_verified: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; password: string; name: string; role: UserRole; }

// ── Student Profile ──────────────────────────────────────────────────────────
export interface SkillSet {
  programming_languages: string[];
  frameworks: string[];
  databases: string[];
  ai_skills: string[];
  other: string[];
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  college: string;
  department: string;
  year: number;
  bio?: string;
  skills: SkillSet;
  links: SocialLinks;
  interests: string[];
  resume_url?: string;
  avatar_url?: string;
  projects_created: number;
  projects_joined: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyProfile {
  id: string;
  user_id: string;
  name: string;
  college: string;
  department: string;
  designation: string;
  bio?: string;
  links: SocialLinks;
  avatar_url?: string;
}

// ── Projects ─────────────────────────────────────────────────────────────────
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface Project {
  id: string;
  owner_id: string;
  owner_name: string;
  title: string;
  description: string;
  tech_stack: string[];
  domain?: string;
  github_url?: string;
  tags: string[];
  status: ProjectStatus;
  quality_score?: number;
  originality_score?: number;
  views: number;
  created_at: string;
  updated_at: string;
}

// ── Showcase ──────────────────────────────────────────────────────────────────
export interface Showcase {
  id: string;
  project_id: string;
  owner_id: string;
  owner_name: string;
  project_title: string;
  description: string;
  features: string[];
  screenshots: string[];
  github_url?: string;
  deployment_url?: string;
  demo_video_url?: string;
  zip_url?: string;
  tech_stack: string[];
  tags: string[];
  views: number;
  likes: number;
  downloads: number;
  created_at: string;
}

// ── Achievements ──────────────────────────────────────────────────────────────
export type AchievementType =
  | 'hackathon' | 'certification' | 'internship'
  | 'research_paper' | 'workshop' | 'open_source'
  | 'competition' | 'other';

export interface Achievement {
  id: string;
  student_id: string;
  title: string;
  description: string;
  organization: string;
  achievement_type: AchievementType;
  date: string;
  position?: string;
  url?: string;
  image_url?: string;
  pdf_url?: string;
  created_at: string;
}

// ── Teams ─────────────────────────────────────────────────────────────────────
export interface Team {
  id: string;
  project_id: string;
  owner_id: string;
  owner_name: string;
  name: string;
  description?: string;
  required_skills: string[];
  max_members: number;
  members: string[];
  domain?: string;
  is_open: boolean;
  created_at: string;
}

export interface TeamRequest {
  id: string;
  team_id: string;
  applicant_id: string;
  applicant_name: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  match_score: number;
  created_at: string;
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ── Messages ──────────────────────────────────────────────────────────────────
export interface Message {
  id?: string;
  team_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: 'text' | 'file';
  timestamp: string;
}

// ── Scores ────────────────────────────────────────────────────────────────────
export interface ImpactScore {
  student_id: string;
  technical_score: number;
  innovation_score: number;
  achievement_score: number;
  contribution_score: number;
  teamwork_score: number;
  overall_score: number;
  department_rank?: number;
  college_rank?: number;
  updated_at?: string;
}

export interface AchievementScore {
  student_id: string;
  technical_score: number;
  leadership_score: number;
  innovation_score: number;
  achievement_score: number;
  summary?: string;
}

// ── AI ─────────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface SimilarProject {
  project_id: string;
  title: string;
  owner_name: string;
  similarity_score: number;
  quality_score?: number;
  originality_score?: number;
  showcase_id?: string;
  created_at?: string;
}

export interface ValidationResult {
  similar_projects: SimilarProject[];
  originality_score: number;
  similarity_score: number;
  recommendation: string;
}

export interface QualityReport {
  overall_score: number;
  code_score: number;
  documentation_score: number;
  security_score: number;
  testing_score: number;
  has_readme: boolean;
  has_tests: boolean;
  suggestions: string[];
  issues: { severity: string; message: string; file?: string }[];
}

export interface OriginalityReport {
  originality_score: number;
  similarity_percentage: number;
  matched_projects: { project_id: string; title: string; author: string; similarity: number }[];
  verdict: string;
}

// ── Admin / Analytics ─────────────────────────────────────────────────────────
export interface PlatformStats {
  total_users: number;
  total_students: number;
  total_faculty: number;
  total_projects: number;
  total_showcases: number;
}

export interface ContributionReport {
  member_id: string;
  member_name: string;
  tasks_completed: number;
  messages_sent: number;
  contribution_percentage: number;
}
