# ProjectVerse AI - System Architecture

## Overview
ProjectVerse AI is a comprehensive ecosystem for colleges that combines LinkedIn (networking), GitHub (project showcase), Discord (collaboration), LeetCode (coding arena), ChatGPT (AI assistance), Upwork (opportunities), Eventbrite (events), Notion (workspace), and Trello (project management).

## Architecture Pattern
**Microservices-Ready Monolith** (Modular Monolith that can split into microservices)

## System Components

```
+-------------------------------------------------------------+
|                     CLIENT LAYER                             |
+-------------+----------------+------------------------------+
|   Web App    |   Mobile App   |      Admin Panel            |
|  (React+TS)  |   (Flutter)    |     (React+TS)              |
+------+-------+--------+-------+--------------+--------------+
       |                |                      |
       +----------------+----------------------+
                          |
+-------------------------------------------------------------+
|                     API GATEWAY                              |
|              (Rate Limiting, Auth, Routing)                  |
+-------------------------------------------------------------+
                          |
+-------------------------------------------------------------+
|                   APPLICATION LAYER                          |
|  +--------+ +--------+ +--------+ +--------+ +---------+   |
|  | Auth   | | User   | |Project | |Event   | |Messaging|   |
|  |Module  | |Module  | |Module  | |Module  | |Module   |   |
|  +--------+ +--------+ +--------+ +--------+ +---------+   |
|  +--------+ +--------+ +--------+ +--------+ +---------+   |
|  |Coding  | |AI      | |Workspace| |Company | |Analytics|   |
|  |Arena   | |Module  | |Module  | |Portal  | |Module   |   |
|  +--------+ +--------+ +--------+ +--------+ +---------+   |
+-------------------------------------------------------------+
                          |
+-------------------------------------------------------------+
|  Service Layer                             |
|  +-------------------+  +-------------------------------+   |
|  |  AI Service       |  |  Notification Service         |   |
|  |  - Ollama LLM     |  |  - Socket.IO                  |   |
|  |  - Transformers   |  |  - Email                      |   |
|  |  - ML Models      |  |  - Push                       |   |
|  +-------------------+  +-------------------------------+   |
|  +-------------------+  +-------------------------------+   |
|  |  Realtime Service |  |  Media Service                |   |
|  |  - Socket.IO      |  |  - Cloudinary                 |   |
|  |  - WebRTC         |  |  - Upload/Download            |   |
|  +-------------------+  +-------------------------------+   |
+-------------------------------------------------------------+
                          |
+-------------------------------------------------------------+
|                    DATA LAYER                                |
|  +----------------+  +---------------+  +----------------+  |
|  | MongoDB Atlas  |  |    Redis      |  |  Cloudinary    |  |
|  | (Primary DB)   |  |   (Cache)     |  |  (File Store)  |  |
|  +----------------+  +---------------+  +----------------+  |
+-------------------------------------------------------------+
                          |
+-------------------------------------------------------------+
|                EXTERNAL SERVICES                             |
|  +----------+  +-------------+                               |
|  |  Google  |  |   WebRTC    |                               |
|  |  OAuth   |  |   Servers   |                               |
|  +----------+  +-------------+                               |
+-------------------------------------------------------------+
```

## Tech Stack Summary

### Frontend (Web)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + ShadCN UI
- **Animation**: Framer Motion
- **State Management**: Zustand + React Query (TanStack Query)
- **Charts**: Recharts
- **Maps**: Leaflet (for event locations)
- **Code Editor**: Monaco Editor (for coding arena)

### Mobile
- **Framework**: Flutter + Dart
- **State Management**: Provider/Bloc
- **HTTP Client**: Dio
- **Local Storage**: Hive

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Validation**: Zod + express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI

### Database
- **Primary**: MongoDB Atlas (NoSQL)
- **Cache**: Redis (Upstash)
- **Search**: MongoDB Atlas Search (or Elasticsearch)
- **File Storage**: Cloudinary

### Authentication
- **JWT**: Access Token + Refresh Token
- **OAuth 2.0**: Google Sign-In
- **Role-Based Access Control**: 5 roles (Student, Faculty, Company, Alumni, Admin)

### Realtime
- **WebSocket**: Socket.IO
- **Video/Audio**: WebRTC (simple-peer)
- **Signaling**: Socket.IO

### AI/ML
- **LLM**: Local Ollama (llama3.1:8b for Chat/Mentor/CoFounder, codellama:7b for Code Review)
- **Embeddings**: Local `@xenova/transformers` (all-MiniLM-L6-v2, bge-small-en-v1.5)
- **ML Models**: scikit-learn, XGBoost (Python Flask microservice on port 7001)

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Web**: Vercel/Netlify
- **API**: Render/AWS EC2
- **Monitoring**: PM2 + Winston

## Module Dependencies

```
Phase 1 (Foundation):
  Auth Module -> Profile Module -> Project Module -> Collaboration Module -> Event Module

Phase 2 (Communication):
  Messaging Module -> Call Module -> Workspace Module -> Coding Arena Module

Phase 3 (AI Intelligence):
  AI Mentor Module -> AI Co-Founder Module -> AI Chatbot Module -> ML Services

Phase 4 (Advanced):
  Company Portal -> Faculty Portal -> Research Hub -> Startup Hub -> Analytics
```

## Communication Flow

### Authentication Flow
```
User -> Frontend -> API Gateway -> Auth Controller -> MongoDB
                                      |
                                   JWT Token
                                      |
                              Redis (Session Store)
```

### AI Chat Flow
```
User -> Frontend -> API Gateway -> AI Controller -> Local Ollama Service (Port 11434)
                                      |
                                MongoDB (Chat History)
                                      |
                                Local Transformers (for Embeddings)
```

### Realtime Messaging Flow
```
User A -> Socket.IO -> Server -> Redis (Pub/Sub) -> Socket.IO -> User B
              |
         MongoDB (Message Store)
```

### Video Call Flow
```
User A -> WebRTC (Offer) -> Socket.IO Signaling -> User B -> WebRTC Answer
                                    |
                              STUN/TURN Servers
```

## Security Architecture

### Authentication
- JWT with short-lived access tokens (15 min) and long-lived refresh tokens (7 days)
- HttpOnly cookies for refresh tokens
- Bearer tokens in Authorization header for API requests

### Authorization
- Role-based access control (RBAC) with 5 roles
- Permission middleware on every route
- Resource-level ownership checks

### Data Protection
- Input validation with Zod schemas
- XSS protection via Helmet
- CSRF protection
- Rate limiting per IP and per user
- MongoDB injection prevention via Mongoose

### File Uploads
- File type validation
- File size limits
- Virus scanning (ClamAV)
- Cloudinary secure URLs

## Scalability Plan

### Horizontal Scaling
- Stateless API servers behind load balancer
- Redis for shared session store
- MongoDB replica sets
- Socket.IO with Redis adapter

### Caching Strategy
- API responses: Redis (5 min TTL)
- User sessions: Redis (session TTL)
- Static assets: CDN (Cloudflare)
- AI responses: Redis (1 hour TTL for identical queries)

### Database Optimization
- Indexes on frequently queried fields
- Compound indexes for search queries
- Database connection pooling
- Read replicas for analytics queries
