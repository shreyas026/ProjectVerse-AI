// User Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'student' | 'faculty' | 'company' | 'alumni' | 'admin';
  phone?: string;
  college?: {
    name: string;
    department: string;
    yearOfStudy: number;
    rollNumber: string;
    graduationYear: number;
  };
  social?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
    website?: string;
  };
  scores?: {
    codingRating: number;
    contributionScore: number;
    innovationScore: number;
    reliabilityScore: number;
    placementReadiness: number;
  };
  skills: Skill[];
  interests: string[];
  achievements: Achievement[];
  certifications: Certification[];
  status: string;
  isEmailVerified: boolean;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  icon: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  image?: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: {
    accessToken: string;
    refreshToken: string;
  } | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  college?: {
    name: string;
    department: string;
    yearOfStudy: number;
    rollNumber: string;
    graduationYear: number;
  };
}

// Project Types
export interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  owner: User;
  team: TeamMember[];
  thumbnail?: string;
  screenshots: string[];
  demoVideo?: string;
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  category: string;
  technologies: string[];
  tags: string[];
  status: 'idea' | 'planning' | 'in_progress' | 'completed' | 'deployed';
  isPublic: boolean;
  originalityScore?: number;
  views: number;
  likes: string[];
  bookmarks: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: User;
  role: string;
  contribution?: string;
}

export interface Comment {
  userId: User;
  text: string;
  createdAt: string;
}

// Team Types
export interface Team {
  _id: string;
  name: string;
  description: string;
  avatar?: string;
  leader: User;
  members: TeamMemberDetail[];
  projectId?: Project;
  requirements: TeamRequirements;
  status: 'forming' | 'active' | 'completed' | 'disbanded';
  createdAt: string;
}

export interface TeamMemberDetail {
  userId: User;
  role: string;
  joinedAt: string;
  contribution: number;
}

export interface TeamRequirements {
  skillsNeeded: string[];
  rolesNeeded: string[];
  departmentPreference: string[];
  isOpen: boolean;
}

export interface TeamApplication {
  _id: string;
  teamId: string;
  applicantId: User;
  message: string;
  skills: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Event Types
export interface Event {
  _id: string;
  title: string;
  description: string;
  organizer: User;
  organizerType: string;
  type: 'hackathon' | 'workshop' | 'conference' | 'coding_contest' | 'webinar' | 'seminar' | 'cultural';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  mode: 'online' | 'offline' | 'hybrid';
  venue?: string;
  location?: {
    address: string;
    city: string;
    coordinates: number[];
  };
  banner?: string;
  maxParticipants: number;
  currentParticipants: number;
  prizes: Prize[];
  tags: string[];
  technologies: string[];
  skillLevel: string;
  status: string;
  isRegistered?: boolean;
  createdAt: string;
}

export interface Prize {
  position: string;
  reward: string;
  amount: number;
}

// Message Types
export interface Conversation {
  _id: string;
  type: 'direct' | 'group';
  participants: User[];
  name?: string;
  description?: string;
  avatar?: string;
  lastMessage?: {
    content: string;
    sender: User;
    timestamp: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: {
    type: 'text' | 'image' | 'file' | 'code';
    text: string;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: number;
    language?: string;
  };
  isEdited: boolean;
  editedAt?: string;
  reactions: Reaction[];
  readBy: ReadReceipt[];
  createdAt: string;
}

export interface Reaction {
  userId: string;
  emoji: string;
}

export interface ReadReceipt {
  userId: string;
  readAt: string;
}

// Coding Types
export interface CodingChallenge {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: TestExample[];
  tags: string[];
  category: string;
  points: number;
  timeLimit: number;
  memoryLimit: number;
  totalSubmissions: number;
  totalAccepted: number;
  acceptanceRate: number;
  solution?: string;
  hints: string[];
  createdAt: string;
}

export interface TestExample {
  input: string;
  output: string;
  explanation: string;
}

export interface CodingSubmission {
  _id: string;
  userId: string;
  challengeId: string;
  code: string;
  language: string;
  status: string;
  testCaseResults: TestCaseResult[];
  executionTime: number;
  memoryUsed: number;
  score: number;
  aiReview?: AIReview;
  submittedAt: string;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  executionTime: number;
  memoryUsed: number;
}

export interface AIReview {
  codeQuality: number;
  suggestions: string[];
  optimizedSolution: string;
  complexity: {
    time: string;
    space: string;
  };
}

// AI Types
export interface AIConversation {
  _id: string;
  aiType: 'mentor' | 'cofounder' | 'chatbot';
  title: string;
  messages: AIMessage[];
  context: AIContext;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: AIAttachment[];
  artifacts?: AIArtifact[];
}

export interface AIAttachment {
  type: string;
  data: unknown;
}

export interface AIArtifact {
  type: string;
  data: unknown;
}

export interface AIContext {
  topic?: string;
  skills?: string[];
  projectIdea?: string;
  careerGoal?: string;
}

// Company Types
export interface Company {
  _id: string;
  userId: User;
  companyDetails: {
    name: string;
    logo?: string;
    banner?: string;
    description: string;
    mission?: string;
    culture?: string;
    founded?: number;
    employees?: string;
    website?: string;
    industry: string;
  };
  locations: CompanyLocation[];
  benefits: string[];
  hiringStatus: boolean;
  openPositions: number;
  verified: boolean;
}

export interface CompanyLocation {
  type: string;
  city: string;
  state: string;
  country: string;
  address: string;
}

export interface JobPosting {
  _id: string;
  companyId: Company;
  title: string;
  description: string;
  type: string;
  skillsRequired: JobSkill[];
  experience: { min: number; max: number };
  location: { type: string; city: string; country: string };
  salary?: { min: number; max: number; currency: string; period: string };
  applicationDeadline: string;
  status: string;
  createdAt: string;
}

export interface JobSkill {
  skill: string;
  level: string;
}

// Research Types
export interface ResearchOpportunity {
  _id: string;
  facultyId: User;
  title: string;
  description: string;
  domain: string;
  skillsRequired: string[];
  positionsAvailable: number;
  duration: string;
  stipend?: { amount: number; currency: string; period: string };
  status: string;
  applications: ResearchApplication[];
  createdAt: string;
}

export interface ResearchApplication {
  studentId: User;
  statement: string;
  status: string;
  appliedAt: string;
}

// Startup Types
export interface Startup {
  _id: string;
  founderId: User;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  stage: string;
  logo?: string;
  teamMembers: StartupTeamMember[];
  lookingFor: {
    coFounders: boolean;
    developers: boolean;
    designers: boolean;
    marketers: boolean;
    investors: boolean;
  };
  status: string;
  createdAt: string;
}

export interface StartupTeamMember {
  userId: User;
  role: string;
}

// Workspace Types
export interface WorkspaceTask {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: User;
  createdBy: User;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceNote {
  _id: string;
  projectId: string;
  title: string;
  content: string;
  createdBy: User;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  link?: string;
  image?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// Analytics Types
export interface AnalyticsData {
  totalUsers: number;
  totalProjects: number;
  totalEvents: number;
  activeUsers: number;
  departmentStats: DepartmentStat[];
  monthlyGrowth: MonthlyStat[];
  topProjects: Project[];
  leaderboard: LeaderboardEntry[];
}

export interface DepartmentStat {
  department: string;
  userCount: number;
  projectCount: number;
  avgCodingScore: number;
}

export interface MonthlyStat {
  month: string;
  users: number;
  projects: number;
  events: number;
}

export interface LeaderboardEntry {
  userId: User;
  innovationScore: number;
  codingScore: number;
  contributionScore: number;
  totalScore: number;
  rank: number;
}
