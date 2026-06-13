# ProjectVerse AI - API Design

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.projectverse.ai/v1
```

## Authentication
All endpoints require Bearer token except public endpoints marked with `[PUBLIC]`.

```
Authorization: Bearer <access_token>
```

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [{"field": "email", "message": "Email is required"}]
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## MODULE 1: AUTHENTICATION (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | [PUBLIC] |
| POST | `/auth/login` | Login with email/password | [PUBLIC] |
| POST | `/auth/google` | Google OAuth login | [PUBLIC] |
| POST | `/auth/forgot-password` | Request password reset | [PUBLIC] |
| POST | `/auth/reset-password` | Reset password with token | [PUBLIC] |
| POST | `/auth/verify-email` | Verify email address | [PUBLIC] |
| POST | `/auth/resend-verification` | Resend verification email | [PUBLIC] |
| POST | `/auth/refresh` | Refresh access token | [PUBLIC] |
| POST | `/auth/logout` | Logout and invalidate tokens | Required |
| GET | `/auth/me` | Get current user | Required |
| PUT | `/auth/change-password` | Change password | Required |

### Request Examples

**Register:**
```json
POST /api/v1/auth/register
{
  "email": "student@college.edu",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "college": {
    "name": "MIT",
    "department": "CSE",
    "yearOfStudy": 3,
    "rollNumber": "CSE2021001",
    "graduationYear": 2025
  }
}
```

**Login:**
```json
POST /api/v1/auth/login
{
  "email": "student@college.edu",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "student", "firstName": "..." },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
  }
}
```

---

## MODULE 2: USERS (`/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | List users with filters | Required |
| GET | `/users/:id` | Get user by ID | Required |
| PUT | `/users/:id` | Update user profile | Required |
| DELETE | `/users/:id` | Delete user account | Admin |
| GET | `/users/:id/skills` | Get user skills | Required |
| PUT | `/users/:id/skills` | Update user skills | Required |
| GET | `/users/:id/projects` | Get user projects | Required |
| GET | `/users/:id/achievements` | Get user achievements | Required |
| GET | `/users/search` | Search users | Required |
| GET | `/users/recommendations` | Get team recommendations | Required |
| GET | `/users/leaderboard` | Get innovation leaderboard | Required |

### Query Parameters for `/users`
```
?role=student&department=CSE&skills=react,nodejs&year=3&page=1&limit=20
```

---

## MODULE 3: PROJECTS (`/projects`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/projects` | List projects | [PUBLIC] |
| GET | `/projects/:id` | Get project details | [PUBLIC] |
| POST | `/projects` | Create new project | Required |
| PUT | `/projects/:id` | Update project | Owner |
| DELETE | `/projects/:id` | Delete project | Owner |
| POST | `/projects/:id/like` | Like/unlike project | Required |
| POST | `/projects/:id/bookmark` | Bookmark project | Required |
| POST | `/projects/:id/comment` | Add comment | Required |
| GET | `/projects/:id/comments` | Get comments | [PUBLIC] |
| GET | `/projects/search` | Search projects | [PUBLIC] |
| GET | `/projects/semantic-search` | AI-powered search | Required |
| POST | `/projects/:id/check-originality` | Check project originality | Owner |
| GET | `/projects/featured` | Get featured projects | [PUBLIC] |
| GET | `/projects/trending` | Get trending projects | [PUBLIC] |

### Request: Create Project
```json
POST /api/v1/projects
{
  "title": "Smart Agriculture IoT Platform",
  "description": "Full-stack IoT platform for smart farming...",
  "shortDescription": "IoT-based smart agriculture monitoring system",
  "category": "IoT",
  "technologies": ["React", "Node.js", "MongoDB", "Raspberry Pi", "MQTT"],
  "tags": ["agriculture", "iot", "fullstack"],
  "githubUrl": "https://github.com/user/smart-agri",
  "liveUrl": "https://smart-agri.demo",
  "isPublic": true,
  "thumbnail": "file-upload",
  "screenshots": ["file1", "file2"]
}
```

---

## MODULE 4: TEAMS (`/teams`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/teams` | List teams | Required |
| GET | `/teams/:id` | Get team details | Required |
| POST | `/teams` | Create team | Required |
| PUT | `/teams/:id` | Update team | Leader |
| DELETE | `/teams/:id` | Disband team | Leader |
| POST | `/teams/:id/apply` | Apply to join team | Required |
| PUT | `/teams/:id/applications/:appId` | Review application | Leader |
| POST | `/teams/:id/members` | Add member | Leader |
| DELETE | `/teams/:id/members/:userId` | Remove member | Leader |
| GET | `/teams/:id/members` | Get team members | Required |
| GET | `/teams/recommendations` | AI team recommendations | Required |

---

## MODULE 5: EVENTS (`/events`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/events` | List events | [PUBLIC] |
| GET | `/events/:id` | Get event details | [PUBLIC] |
| POST | `/events` | Create event | Required |
| PUT | `/events/:id` | Update event | Organizer |
| DELETE | `/events/:id` | Cancel event | Organizer |
| POST | `/events/:id/register` | Register for event | Required |
| DELETE | `/events/:id/register` | Cancel registration | Required |
| GET | `/events/:id/registrations` | Get registrations | Organizer |
| GET | `/events/recommendations` | AI event recommendations | Required |
| GET | `/events/my-events` | Get my registered events | Required |
| GET | `/events/upcoming` | Get upcoming events | [PUBLIC] |

---

## MODULE 6: MESSAGING (`/messages`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/conversations` | List conversations | Required |
| GET | `/conversations/:id` | Get conversation | Required |
| POST | `/conversations` | Start conversation | Required |
| DELETE | `/conversations/:id` | Delete conversation | Participant |
| GET | `/conversations/:id/messages` | Get messages | Required |
| POST | `/conversations/:id/messages` | Send message | Required |
| PUT | `/messages/:id` | Edit message | Sender |
| DELETE | `/messages/:id` | Delete message | Sender |
| POST | `/messages/:id/react` | Add reaction | Required |
| POST | `/conversations/:id/read` | Mark as read | Required |

### WebSocket Events
```javascript
// Client -> Server
socket.emit('join_conversation', { conversationId });
socket.emit('send_message', { conversationId, content, type });
socket.emit('typing', { conversationId, isTyping: true });
socket.emit('message_read', { conversationId, messageId });

// Server -> Client
socket.on('new_message', (message) => {});
socket.on('user_typing', ({ userId, isTyping }) => {});
socket.on('message_read_receipt', ({ messageId, readBy }) => {});
socket.on('user_online', ({ userId }) => {});
```

---

## MODULE 7: CALLS (`/calls`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/calls/initiate` | Initiate call | Required |
| POST | `/calls/:id/accept` | Accept call | Required |
| POST | `/calls/:id/reject` | Reject call | Required |
| POST | `/calls/:id/end` | End call | Required |
| GET | `/calls/history` | Get call history | Required |

### WebRTC Signaling (WebSocket)
```javascript
// Call initiation
socket.emit('call_initiate', { recipientId, type: 'video' });

// Signaling
socket.emit('call_offer', { callId, sdp });
socket.emit('call_answer', { callId, sdp });
socket.emit('call_ice_candidate', { callId, candidate });

// Events
socket.on('incoming_call', ({ callId, caller, type }) => {});
socket.on('call_accepted', ({ callId }) => {});
socket.on('call_rejected', ({ callId, reason }) => {});
socket.on('call_ended', ({ callId, duration }) => {});
```

---

## MODULE 8: CODING ARENA (`/coding`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/coding/challenges` | List challenges | Required |
| GET | `/coding/challenges/:id` | Get challenge | Required |
| POST | `/coding/challenges` | Create challenge | Faculty/Admin |
| PUT | `/coding/challenges/:id` | Update challenge | Faculty/Admin |
| POST | `/coding/challenges/:id/submit` | Submit solution | Required |
| GET | `/coding/submissions` | Get my submissions | Required |
| GET | `/coding/submissions/:id` | Get submission details | Required |
| GET | `/coding/leaderboard` | Get coding leaderboard | Required |
| GET | `/coding/contests` | List contests | Required |
| POST | `/coding/contests` | Create contest | Faculty/Admin |
| GET | `/coding/daily-challenge` | Get daily challenge | Required |
| POST | `/coding/submissions/:id/ai-review` | AI code review | Required |

### Request: Submit Solution
```json
POST /api/v1/coding/challenges/:id/submit
{
  "code": "function solve(n) { return n * 2; }",
  "language": "javascript"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "submissionId": "...",
    "status": "accepted",
    "testCases": {
      "total": 10,
      "passed": 10,
      "failed": 0
    },
    "executionTime": 45,
    "memoryUsed": 12,
    "score": 100,
    "rank": 23
  }
}
```

---

## MODULE 9: AI SYSTEMS (`/ai`)

### AI Mentor (`/ai/mentor`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/ai/mentor/conversations` | List mentor chats | Required |
| POST | `/ai/mentor/conversations` | Start new chat | Required |
| GET | `/ai/mentor/conversations/:id` | Get chat history | Required |
| POST | `/ai/mentor/conversations/:id/message` | Send message | Required |
| POST | `/ai/mentor/roadmap` | Generate learning roadmap | Required |
| POST | `/ai/mentor/interview-prep` | Generate interview questions | Required |
| POST | `/ai/mentor/career-guidance` | Get career guidance | Required |

### AI Co-Founder (`/ai/cofounder`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/ai/cofounder/conversations` | List cofounder chats | Required |
| POST | `/ai/cofounder/conversations` | Start new chat | Required |
| GET | `/ai/cofounder/conversations/:id` | Get chat history | Required |
| POST | `/ai/cofounder/conversations/:id/message` | Send message | Required |
| POST | `/ai/cofounder/architecture` | Generate system architecture | Required |
| POST | `/ai/cofounder/database-design` | Generate database schema | Required |
| POST | `/ai/cofounder/api-design` | Generate API specification | Required |
| POST | `/ai/cofounder/sprint-plan` | Generate sprint plan | Required |
| POST | `/ai/cofounder/documentation` | Generate project documentation | Required |

### AI Chatbot (`/ai/chatbot`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/ai/chatbot/conversations` | List chatbot conversations | Required |
| POST | `/ai/chatbot/conversations` | Start new chat | Required |
| POST | `/ai/chatbot/conversations/:id/message` | Send message | Required |
| POST | `/ai/chatbot/explain` | Explain a concept | Required |
| POST | `/ai/chatbot/code-help` | Get coding help | Required |

### Request: AI Mentor Message
```json
POST /api/v1/ai/mentor/conversations/:id/message
{
  "message": "I want to become an AI Engineer. Guide me."
}
```

### Response
```json
{
  "success": true,
  "data": {
    "response": "Great choice! Here's your personalized roadmap...",
    "attachments": {
      "roadmap": {
        "phases": [
          { "phase": "Foundation", "skills": ["Python", "Math", "Statistics"], "duration": "3 months" },
          { "phase": "Machine Learning", "skills": ["Scikit-learn", "Supervised Learning", "Unsupervised Learning"], "duration": "4 months" },
          { "phase": "Deep Learning", "skills": ["PyTorch", "TensorFlow", "CNNs", "RNNs", "Transformers"], "duration": "4 months" },
          { "phase": "MLOps", "skills": ["Docker", "Kubernetes", "MLflow", "CI/CD for ML"], "duration": "3 months" }
        ]
      },
      "certifications": ["Deep Learning Specialization - Coursera", "TensorFlow Developer Certificate", "AWS ML Specialty"],
      "projects": ["Image Classifier with CNN", "Sentiment Analysis with Transformers", "Recommendation System"]
    }
  }
}
```

---

## MODULE 10: COMPANY PORTAL (`/companies`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/companies` | List companies | Required |
| GET | `/companies/:id` | Get company profile | Required |
| PUT | `/companies/:id` | Update company profile | Company |
| GET | `/companies/:id/jobs` | Get company job postings | Required |
| POST | `/companies/:id/jobs` | Post new job | Company |
| GET | `/companies/:id/reviews` | Get company reviews | Required |
| POST | `/companies/:id/reviews` | Add company review | Required |
| GET | `/companies/search` | Search companies | Required |
| GET | `/companies/:id/applicants` | Get applicants for company jobs | Company |

---

## MODULE 11: JOB POSTINGS (`/jobs`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/jobs` | List job postings | Required |
| GET | `/jobs/:id` | Get job details | Required |
| POST | `/jobs` | Create job posting | Company |
| PUT | `/jobs/:id` | Update job posting | Company |
| DELETE | `/jobs/:id` | Close job posting | Company |
| POST | `/jobs/:id/apply` | Apply for job | Student |
| GET | `/jobs/:id/applications` | Get applications | Company |
| PUT | `/jobs/:id/applications/:appId` | Update application status | Company |
| GET | `/jobs/recommendations` | AI job recommendations | Required |
| GET | `/jobs/search` | Search jobs | Required |

---

## MODULE 12: RESEARCH HUB (`/research`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/research` | List research opportunities | Required |
| GET | `/research/:id` | Get research details | Required |
| POST | `/research` | Create research opportunity | Faculty |
| PUT | `/research/:id` | Update research | Faculty |
| DELETE | `/research/:id` | Close research | Faculty |
| POST | `/research/:id/apply` | Apply for research | Student |
| GET | `/research/:id/applications` | Get applications | Faculty |
| PUT | `/research/:id/applications/:appId` | Review application | Faculty |
| GET | `/research/recommendations` | AI recommendations | Required |

---

## MODULE 13: STARTUP HUB (`/startups`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/startups` | List startups | [PUBLIC] |
| GET | `/startups/:id` | Get startup details | [PUBLIC] |
| POST | `/startups` | Register startup | Required |
| PUT | `/startups/:id` | Update startup | Founder |
| DELETE | `/startups/:id` | Close startup | Founder |
| POST | `/startups/:id/join` | Request to join | Required |
| GET | `/startups/recommendations` | AI cofounder recommendations | Required |
| GET | `/startups/featured` | Get featured startups | [PUBLIC] |

---

## MODULE 14: WORKSPACE (`/workspace`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/workspace/projects/:projectId/tasks` | Get tasks | Team Member |
| POST | `/workspace/projects/:projectId/tasks` | Create task | Team Member |
| PUT | `/workspace/tasks/:id` | Update task | Team Member |
| DELETE | `/workspace/tasks/:id` | Delete task | Team Member |
| GET | `/workspace/projects/:projectId/notes` | Get notes | Team Member |
| POST | `/workspace/projects/:projectId/notes` | Create note | Team Member |
| PUT | `/workspace/notes/:id` | Update note | Team Member |
| GET | `/workspace/projects/:projectId/files` | Get files | Team Member |
| POST | `/workspace/projects/:projectId/files` | Upload file | Team Member |
| GET | `/workspace/projects/:projectId/progress` | Get progress | Team Member |

---

## MODULE 15: ANALYTICS (`/analytics`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/analytics/dashboard` | Get admin dashboard | Admin |
| GET | `/analytics/users` | User analytics | Admin |
| GET | `/analytics/projects` | Project analytics | Admin |
| GET | `/analytics/departments` | Department analytics | Admin |
| GET | `/analytics/events` | Event analytics | Admin |
| GET | `/analytics/placements` | Placement analytics | Admin |
| GET | `/analytics/leaderboard` | Innovation leaderboard | [PUBLIC] |
| GET | `/analytics/my-stats` | Get my analytics | Required |

---

## MODULE 16: NOTIFICATIONS (`/notifications`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/notifications` | Get notifications | Required |
| PUT | `/notifications/:id/read` | Mark as read | Required |
| PUT | `/notifications/read-all` | Mark all as read | Required |
| DELETE | `/notifications/:id` | Delete notification | Required |
| GET | `/notifications/unread-count` | Get unread count | Required |
| PUT | `/notifications/preferences` | Update preferences | Required |

---

## MODULE 17: UPLOAD (`/upload`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/upload/image` | Upload image | Required |
| POST | `/upload/video` | Upload video | Required |
| POST | `/upload/document` | Upload document | Required |
| POST | `/upload/avatar` | Upload avatar | Required |
| DELETE | `/upload/:publicId` | Delete file | Owner |

---

## MODULE 18: ML SERVICES (`/ml`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ml/originality-check` | Check project originality | Required |
| POST | `/ml/team-recommendations` | Get team recommendations | Required |
| POST | `/ml/event-recommendations` | Get event recommendations | Required |
| POST | `/ml/career-recommendation` | Get career path recommendation | Required |
| POST | `/ml/placement-prediction` | Predict placement readiness | Required |
| POST | `/ml/code-review` | AI code review | Required |
| POST | `/ml/semantic-search` | Semantic search | Required |
| POST | `/ml/resume-generate` | Generate AI resume | Required |
| POST | `/ml/portfolio-generate` | Generate AI portfolio | Required |

### Request: Originality Check
```json
POST /api/v1/ml/originality-check
{
  "projectId": "project_object_id",
  "title": "Smart Agriculture IoT Platform",
  "description": "Full-stack IoT platform for smart farming using sensors and ML",
  "technologies": ["React", "Node.js", "MongoDB", "IoT", "ML"]
}
```

### Response
```json
{
  "success": true,
  "data": {
    "originalityScore": 78.5,
    "isOriginal": true,
    "similarProjects": [
      {
        "projectId": "...",
        "title": "Farm Monitoring System",
        "similarityScore": 0.65,
        "owner": "..."
      }
    ],
    "suggestions": [
      "Consider adding unique ML models for crop disease detection",
      "Differentiate with blockchain integration for supply chain"
    ]
  }
}
```

---

## WebSocket Events Summary

### Connection
```javascript
const socket = io('wss://api.projectverse.ai', {
  auth: { token: 'Bearer access_token' }
});
```

### Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `join_conversation` | C -> S | Join a chat room |
| `leave_conversation` | C -> S | Leave a chat room |
| `send_message` | C -> S | Send a message |
| `typing` | C -> S | Typing indicator |
| `new_message` | S -> C | New message received |
| `user_typing` | S -> C | User typing indicator |
| `user_online` | S -> C | User came online |
| `user_offline` | S -> C | User went offline |
| `call_initiate` | C -> S | Start a call |
| `call_offer` | C -> S | WebRTC offer |
| `call_answer` | C -> S | WebRTC answer |
| `call_ice_candidate` | C -> S | ICE candidate |
| `incoming_call` | S -> C | Incoming call notification |
| `call_accepted` | S -> C | Call accepted |
| `call_rejected` | S -> C | Call rejected |
| `call_ended` | S -> C | Call ended |
| `notification` | S -> C | New notification |

---

## Rate Limiting

| Endpoint Type | Limit |
|--------------|-------|
| Auth | 5 requests/minute |
| General API | 100 requests/minute |
| AI Chat | 30 requests/minute |
| Code Submission | 10 requests/minute |
| Upload | 10 requests/minute |
| WebSocket | 50 messages/minute |

## Pagination

All list endpoints support:
```
?page=1&limit=20&sort=-createdAt
```

Default: page=1, limit=20, sort=-createdAt

## Filtering

```
?role=student&status=active&skills=react,nodejs
```

## Search

```
?q=machine learning&fields=title,description,tags
```
