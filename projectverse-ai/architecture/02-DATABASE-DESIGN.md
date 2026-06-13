# ProjectVerse AI - Database Design

## Database: MongoDB Atlas

## Collections Overview (17 Collections)

| # | Collection | Purpose | Documents |
|---|-----------|---------|-----------|
| 1 | users | All user accounts (Student, Faculty, Company, Alumni, Admin) | ~10,000 |
| 2 | profiles | Extended profile data per user role | ~10,000 |
| 3 | projects | Student project showcases | ~50,000 |
| 4 | teams | Collaboration teams | ~15,000 |
| 5 | team_applications | Applications to join teams | ~30,000 |
| 6 | events | College events, hackathons, workshops | ~5,000 |
| 7 | event_registrations | User event registrations | ~50,000 |
| 8 | messages | Chat messages (DM & Group) | ~500,000 |
| 9 | conversations | Chat conversation threads | ~50,000 |
| 10 | calls | Audio/video call logs | ~20,000 |
| 11 | coding_challenges | Coding problems/Questions | ~2,000 |
| 12 | coding_submissions | Code submissions & results | ~100,000 |
| 13 | notifications | User notifications | ~200,000 |
| 14 | companies | Company profiles | ~500 |
| 15 | job_postings | Internship/job opportunities | ~5,000 |
| 16 | research_opportunities | Faculty research projects | ~2,000 |
| 17 | startups | Student startup ideas | ~3,000 |
| 18 | contributions | Project contribution tracking | ~100,000 |
| 19 | badges | Achievement badges | ~50 |
| 20 | user_badges | Earned badges per user | ~20,000 |
| 21 | analytics | Platform analytics data | ~1M |
| 22 | workspace_tasks | Project workspace tasks | ~200,000 |
| 23 | workspace_notes | Project workspace notes | ~50,000 |
| 24 | ai_conversations | AI chat history | ~100,000 |

---

## Collection Schemas

### 1. USERS Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed, bcrypt),
  role: String (enum: ['student', 'faculty', 'company', 'alumni', 'admin']),
  
  // Profile
  firstName: String,
  lastName: String,
  avatar: String (Cloudinary URL),
  phone: String,
  
  // College Info (for students/faculty)
  college: {
    name: String,
    department: String (CSE, ECE, MECH, CIVIL, BIOTECH, MBA, etc.),
    yearOfStudy: Number (1-4),
    rollNumber: String,
    graduationYear: Number
  },
  
  // Social Links
  social: {
    github: String,
    linkedin: String,
    portfolio: String,
    twitter: String,
    website: String
  },
  
  // Scores
  scores: {
    codingRating: Number (0-3000, like ELO),
    contributionScore: Number (0-10000),
    innovationScore: Number (0-10000),
    reliabilityScore: Number (0-100),
    placementReadiness: Number (0-100)
  },
  
  // Skills & Interests
  skills: [{
    name: String,
    level: String (enum: ['beginner', 'intermediate', 'advanced', 'expert']),
    verified: Boolean
  }],
  
  interests: [String],
  
  // Achievements
  achievements: [{
    title: String,
    description: String,
    date: Date,
    icon: String
  }],
  
  // Certifications
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialUrl: String,
    image: String
  }],
  
  // Account Status
  status: String (enum: ['active', 'inactive', 'suspended', 'pending_verification']),
  isEmailVerified: Boolean,
  
  // AI Embeddings (for ML features)
  embedding: [Number], // 384-dim vector from all-MiniLM-L6-v2
  
  // Timestamps
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
// db.users.createIndex({ email: 1 }, { unique: true })
// db.users.createIndex({ "college.department": 1, role: 1 })
// db.users.createIndex({ skills.name: 1 })
// db.users.createIndex({ embedding: "2dsphere" }) // for vector similarity
```

### 2. PROFILES Collection (Role-specific extensions)
```javascript
// Student Profile
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  role: 'student',
  
  // Academic
  cgpa: Number,
  backlogs: Number,
  semester: Number,
  
  // Coding Stats
  codingStats: {
    problemsSolved: Number,
    contestsParticipated: Number,
    contestsWon: Number,
    languageProficiency: [{
      language: String,
      problemsSolved: Number
    }],
    rank: Number,
    streak: Number
  },
  
  // Projects
  totalProjects: Number,
  featuredProjects: [ObjectId] (ref: projects),
  
  // Activity
  githubCommits: Number,
  githubRepos: Number,
  
  // Career
  dreamCompanies: [String],
  preferredRoles: [String],
  willingToRelocate: Boolean,
  
  // AI-generated
  careerRecommendations: [String],
  skillGaps: [String],
  learningPath: Object
}

// Faculty Profile
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  role: 'faculty',
  
  designation: String (Professor, Associate Prof, etc.),
  specialization: [String],
  publications: [{
    title: String,
    journal: String,
    year: Number,
    url: String
  }],
  researchAreas: [String],
  officeHours: String,
  cabinLocation: String,
  isAvailableForMentoring: Boolean,
  currentResearchProjects: [ObjectId] (ref: research_opportunities)
}

// Company Profile
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  role: 'company',
  
  companyName: String,
  industry: String,
  companySize: String (startup/small/medium/large/enterprise),
  website: String,
  logo: String,
  description: String,
  location: {
    city: String,
    state: String,
    country: String
  },
  verified: Boolean,
  jobPostings: [ObjectId] (ref: job_postings),
  hiredStudents: [ObjectId] (ref: users)
}

// Alumni Profile
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  role: 'alumni',
  
  graduationYear: Number,
  currentCompany: String,
  currentRole: String,
  yearsOfExperience: Number,
  industry: String,
  isAvailableForMentoring: Boolean,
  mentorshipTopics: [String],
  referralsProvided: Number
}
```

### 3. PROJECTS Collection
```javascript
{
  _id: ObjectId,
  title: String (required, indexed),
  description: String (required),
  shortDescription: String (200 chars for cards),
  
  // Ownership
  owner: ObjectId (ref: users),
  team: [{
    userId: ObjectId (ref: users),
    role: String (lead, developer, designer, etc.),
    contribution: String
  }],
  
  // Media
  thumbnail: String (Cloudinary URL),
  screenshots: [String] (Cloudinary URLs),
  demoVideo: String (Cloudinary URL),
  
  // Links
  githubUrl: String,
  liveUrl: String,
  documentationUrl: String,
  
  // Categorization
  category: String (Web Dev, Mobile, AI/ML, IoT, Blockchain, etc.),
  technologies: [String],
  tags: [String],
  
  // Status
  status: String (enum: ['idea', 'planning', 'in_progress', 'completed', 'deployed']),
  isPublic: Boolean,
  
  // AI Analysis
  originalityScore: Number (0-100),
  similarProjects: [{
    projectId: ObjectId,
    similarityScore: Number
  }],
  embedding: [Number], // 384-dim vector
  
  // Stats
  views: Number,
  likes: [ObjectId] (ref: users),
  bookmarks: [ObjectId] (ref: users),
  comments: [{
    userId: ObjectId (ref: users),
    text: String,
    createdAt: Date
  }],
  
  // Workspace
  workspaceId: ObjectId (ref: workspace),
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
// db.projects.createIndex({ title: "text", description: "text", tags: "text" }) // Full-text search
// db.projects.createIndex({ category: 1, status: 1 })
// db.projects.createIndex({ technologies: 1 })
// db.projects.createIndex({ embedding: "2dsphere" }) // Vector similarity
```

### 4. TEAMS Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  avatar: String (Cloudinary URL),
  
  // Leader
  leader: ObjectId (ref: users),
  
  // Members
  members: [{
    userId: ObjectId (ref: users),
    role: String,
    joinedAt: Date,
    contribution: Number (0-100)
  }],
  
  // Project
  projectId: ObjectId (ref: projects),
  
  // Requirements (for open teams)
  requirements: {
    skillsNeeded: [String],
    rolesNeeded: [String],
    departmentPreference: [String],
    isOpen: Boolean
  },
  
  // AI Matching
  skillEmbedding: [Number],
  
  // Status
  status: String (enum: ['forming', 'active', 'completed', 'disbanded']),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 5. TEAM_APPLICATIONS Collection
```javascript
{
  _id: ObjectId,
  teamId: ObjectId (ref: teams),
  applicantId: ObjectId (ref: users),
  
  message: String,
  skills: [String],
  
  status: String (enum: ['pending', 'accepted', 'rejected']),
  
  reviewedBy: ObjectId (ref: users),
  reviewedAt: Date,
  
  createdAt: Date
}
```

### 6. EVENTS Collection
```javascript
{
  _id: ObjectId,
  title: String (required, indexed),
  description: String (required),
  
  // Organizer
  organizer: ObjectId (ref: users),
  organizerType: String (student, faculty, company, college),
  
  // Event Type
  type: String (enum: ['hackathon', 'workshop', 'conference', 'coding_contest', 'webinar', 'seminar', 'cultural']),
  
  // Timing
  startDate: Date (required),
  endDate: Date (required),
  registrationDeadline: Date,
  
  // Location
  mode: String (enum: ['online', 'offline', 'hybrid']),
  venue: String,
  location: {
    address: String,
    city: String,
    coordinates: [Number] // [longitude, latitude]
  },
  
  // Media
  banner: String (Cloudinary URL),
  gallery: [String],
  
  // Details
  maxParticipants: Number,
  currentParticipants: Number,
  prizes: [{
    position: String,
    reward: String,
    amount: Number
  }],
  
  // Agenda
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: String
  }],
  
  // Tags for recommendation
  tags: [String],
  technologies: [String],
  skillLevel: String (beginner, intermediate, advanced, all),
  
  // Status
  status: String (enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled']),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 7. MESSAGES Collection
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: conversations),
  
  sender: ObjectId (ref: users),
  
  content: {
    type: String (enum: ['text', 'image', 'file', 'code', 'audio']),
    text: String,
    mediaUrl: String,
    fileName: String,
    fileSize: Number,
    language: String // for code messages
  },
  
  // Metadata
  isEdited: Boolean,
  editedAt: Date,
  
  // Reactions
  reactions: [{
    userId: ObjectId,
    emoji: String
  }],
  
  // Read status
  readBy: [{
    userId: ObjectId,
    readAt: Date
  }],
  
  createdAt: Date
}

// Indexes
// db.messages.createIndex({ conversationId: 1, createdAt: -1 })
```

### 8. CONVERSATIONS Collection
```javascript
{
  _id: ObjectId,
  type: String (enum: ['direct', 'group']),
  
  // For direct messages
  participants: [ObjectId] (ref: users, max 2 for direct),
  
  // For group
  name: String,
  description: String,
  avatar: String,
  admins: [ObjectId] (ref: users),
  
  // Common
  lastMessage: {
    content: String,
    sender: ObjectId,
    timestamp: Date
  },
  
  unreadCounts: {
    userId: Number // Map of userId to unread count
  },
  
  isArchived: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
// db.conversations.createIndex({ participants: 1 })
```

### 9. CODING_CHALLENGES Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  difficulty: String (enum: ['easy', 'medium', 'hard', 'expert']),
  
  // Problem
  problemStatement: String,
  inputFormat: String,
  outputFormat: String,
  constraints: String,
  
  // Examples
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  
  // Test Cases (hidden)
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: Boolean,
    weight: Number
  }],
  
  // Tags
  tags: [String],
  category: String (algorithms, data_structures, dp, graphs, etc.),
  companies: [String], // companies that asked this
  
  // Metadata
  points: Number,
  timeLimit: Number (in seconds),
  memoryLimit: Number (in MB),
  
  // Stats
  totalSubmissions: Number,
  totalAccepted: Number,
  acceptanceRate: Number,
  
  // AI-generated
  solution: String,
  hints: [String],
  embedding: [Number],
  
  createdBy: ObjectId (ref: users),
  createdAt: Date,
  updatedAt: Date
}
```

### 10. CODING_SUBMISSIONS Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  challengeId: ObjectId (ref: coding_challenges),
  
  code: String,
  language: String (cpp, java, python, javascript, etc.),
  
  // Results
  status: String (enum: ['pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error']),
  
  testCaseResults: [{
    testCaseId: ObjectId,
    passed: Boolean,
    actualOutput: String,
    executionTime: Number,
    memoryUsed: Number
  }],
  
  // Stats
  executionTime: Number (max),
  memoryUsed: Number (max),
  score: Number,
  
  // AI Review
  aiReview: {
    codeQuality: Number (0-100),
    suggestions: [String],
    optimizedSolution: String,
    complexity: {
      time: String,
      space: String
    }
  },
  
  submittedAt: Date
}

// Indexes
// db.coding_submissions.createIndex({ userId: 1, challengeId: 1 })
// db.coding_submissions.createIndex({ status: 1 })
```

### 11. NOTIFICATIONS Collection
```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: users),
  
  type: String (enum: [
    'team_invite', 'team_accepted', 'project_like',
    'event_reminder', 'event_registration',
    'message', 'call_missed',
    'badge_earned', 'achievement',
    'job_application', 'interview_call',
    'ai_mentor', 'system'
  ]),
  
  title: String,
  message: String,
  
  // Deep link
  entityType: String,
  entityId: ObjectId,
  link: String,
  
  // Media
  image: String,
  
  // Status
  isRead: Boolean,
  readAt: Date,
  
  createdAt: Date
}

// Indexes
// db.notifications.createIndex({ recipient: 1, isRead: 1, createdAt: -1 })
```

### 12. COMPANIES Collection (Extended company data)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  
  companyDetails: {
    name: String,
    logo: String,
    banner: String,
    description: String,
    mission: String,
    culture: String,
    founded: Number,
    employees: String,
    revenue: String,
    website: String,
    industry: String,
    subIndustry: String
  },
  
  locations: [{
    type: String (headquarter, branch),
    city: String,
    state: String,
    country: String,
    address: String
  }],
  
  benefits: [String],
  
  // Hiring
  hiringStatus: Boolean,
  openPositions: Number,
  
  // College Relations
  preferredColleges: [String],
  visitedColleges: [{
    collegeName: String,
    visitDate: Date,
    hiredCount: Number
  }],
  
  // Reviews
  reviews: [{
    userId: ObjectId,
    rating: Number (1-5),
    pros: String,
    cons: String,
    createdAt: Date
  }],
  
  verified: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 13. JOB_POSTINGS Collection
```javascript
{
  _id: ObjectId,
  companyId: ObjectId (ref: companies),
  postedBy: ObjectId (ref: users),
  
  title: String (required),
  description: String (required),
  
  type: String (enum: ['internship', 'full_time', 'part_time', 'contract', 'freelance']),
  
  // Requirements
  skillsRequired: [{
    skill: String,
    level: String (beginner, intermediate, advanced)
  }],
  experience: {
    min: Number,
    max: Number
  },
  qualifications: [String],
  responsibilities: [String],
  
  // Location
  location: {
    type: String (remote, on_site, hybrid),
    city: String,
    country: String
  },
  
  // Compensation
  salary: {
    min: Number,
    max: Number,
    currency: String,
    period: String (monthly, yearly, hourly)
  },
  
  // Application
  applicationDeadline: Date,
  maxApplicants: Number,
  currentApplicants: Number,
  
  // Status
  status: String (enum: ['draft', 'active', 'paused', 'closed', 'filled']),
  
  // AI
  embedding: [Number],
  
  createdAt: Date,
  updatedAt: Date
}
```

### 14. RESEARCH_OPPORTUNITIES Collection
```javascript
{
  _id: ObjectId,
  facultyId: ObjectId (ref: users),
  
  title: String (required),
  description: String (required),
  
  // Research Details
  domain: String (AI, ML, IoT, Blockchain, etc.),
  subDomain: [String],
  
  // Requirements
  skillsRequired: [String],
  prerequisites: [String],
  yearPreference: [Number],
  departmentPreference: [String],
  
  // Position
  positionsAvailable: Number,
  duration: String,
  stipend: {
    amount: Number,
    currency: String,
    period: String
  },
  
  // Status
  status: String (enum: ['open', 'in_progress', 'closed', 'completed']),
  
  // Applications
  applications: [{
    studentId: ObjectId,
    statement: String,
    resume: String,
    status: String,
    appliedAt: Date
  }],
  
  // Publications Target
  targetPublications: [{
    journal: String,
    deadline: Date
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

### 15. STARTUPS Collection
```javascript
{
  _id: ObjectId,
  founderId: ObjectId (ref: users),
  
  name: String (required),
  tagline: String,
  description: String,
  problem: String,
  solution: String,
  
  // Media
  logo: String,
  pitchDeck: String,
  demoVideo: String,
  
  // Details
  industry: String,
  stage: String (enum: ['idea', 'mvp', 'early_traction', 'growth', 'scaling']),
  
  // Team
  coFounders: [{
    userId: ObjectId,
    role: String,
    equity: Number
  }],
  teamMembers: [{
    userId: ObjectId,
    role: String
  }],
  
  // Looking for
  lookingFor: {
    coFounders: Boolean,
    developers: Boolean,
    designers: Boolean,
    marketers: Boolean,
    investors: Boolean
  },
  
  // Funding
  funding: {
    raised: Number,
    target: Number,
    stage: String (pre_seed, seed, series_a, etc.)
  },
  
  // Metrics
  metrics: {
    users: Number,
    revenue: Number,
    growthRate: Number
  },
  
  // AI-generated
  businessPlan: Object,
  swotAnalysis: Object,
  
  status: String (enum: ['active', 'inactive', 'acquired', 'closed']),
  
  createdAt: Date,
  updatedAt: Date
}
```

### 16. CONTRIBUTIONS Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  projectId: ObjectId (ref: projects),
  
  // Contribution Type
  type: String (enum: ['commit', 'task', 'document', 'meeting', 'review', 'design']),
  
  // Details
  description: String,
  commitHash: String,
  pullRequestUrl: String,
  filesChanged: [String],
  linesAdded: Number,
  linesRemoved: Number,
  
  // AI Analysis
  impact: Number (0-100),
  quality: Number (0-100),
  
  // Points earned
  points: Number,
  
  createdAt: Date
}
```

### 17. AI_CONVERSATIONS Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  
  aiType: String (enum: ['mentor', 'cofounder', 'chatbot']),
  
  title: String, // Auto-generated from first message
  
  messages: [{
    role: String (enum: ['user', 'assistant']),
    content: String,
    timestamp: Date,
    
    // For AI Mentor
    attachments: [{
      type: String (roadmap, certificate_list, resource_list),
      data: Object
    }],
    
    // For AI Co-Founder
    artifacts: [{
      type: String (architecture, db_schema, api_spec, timeline),
      data: Object
    }]
  }],
  
  // Context
  context: {
    topic: String,
    skills: [String],
    projectIdea: String,
    careerGoal: String
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

## Relationships Diagram

```
users (1) -----> (1) profiles
users (1) -----> (N) projects
users (1) -----> (N) teams (as leader/member)
users (1) -----> (N) messages
users (1) -----> (N) notifications
users (1) -----> (N) coding_submissions
users (1) -----> (N) ai_conversations

projects (1) -----> (N) contributions
projects (1) -----> (1) workspace (tasks + notes)

teams (1) -----> (N) team_applications
teams (1) -----> (1) projects

events (1) -----> (N) event_registrations

companies (1) -----> (N) job_postings
companies (1) -----> (N) reviews

conversations (1) -----> (N) messages

users (N) <-----> (N) conversations
users (N) <-----> (N) teams
users (N) <-----> (N) events (registrations)
```

## Data Flow Patterns

### Vector Similarity Search (for ML features)
```
User Input -> Embedding Model (all-MiniLM-L6-v2) -> Vector [384-dim]
                                                      |
                                              MongoDB Atlas Search
                                              (Vector Search Index)
                                                      |
                                              Similar Documents
                                                      |
                                              Cosine Similarity Score
```

### AI Response Flow
```
User Query -> Context Builder -> Gemini API -> Structured Response
                                    |
                              Conversation History
                                    |
                              User Profile Data
```
