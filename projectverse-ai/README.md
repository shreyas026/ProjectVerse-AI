# ProjectVerse AI

**AI-Powered Innovation, Collaboration, Learning & Talent Discovery Ecosystem**

ProjectVerse AI is a comprehensive platform that combines the best features of LinkedIn, GitHub, Discord, LeetCode, ChatGPT, Upwork, Eventbrite, Notion, and Trello into a single ecosystem designed specifically for colleges and universities.

## Features

### Core Modules (21 Total)

| Module | Description | Status |
|--------|-------------|--------|
| Authentication | JWT + Google OAuth, Role-based access | Done |
| Student Profiles | Skills, certifications, achievements, coding rating | Done |
| Project Showcase | Upload projects, documentation, demo videos | Done |
| Collaboration Hub | Post requirements, apply to teams, team formation | Done |
| Cross-Department Collaboration | CSE, ECE, MECH, CIVIL, BIOTECH, MBA | Done |
| Event Corner | Hackathons, workshops, coding contests | Done |
| Messaging | Direct chat, group chat, file sharing | Done |
| Audio & Video Calls | WebRTC-based real-time calls | Backend Ready |
| Project Workspace | Tasks, notes, team chat (Notion + Trello) | Done |
| Coding Arena | Daily challenges, weekly contests, AI battles | Done |
| AI Mentor | Personal learning mentor (Gemini API) | Done |
| AI Co-Founder | Startup architect & technical advisor (Gemini API) | Done |
| AI Chatbot | General purpose assistant (Gemini API) | Done |
| Research Hub | Faculty research opportunities | Done |
| Company Portal | Company profiles, job postings | Done |
| Alumni Network | Mentorship, job referrals | Done |
| Startup Hub | Register startups, find co-founders | Done |
| Innovation Leaderboard | Rankings across all activities | Done |
| Analytics Dashboard | Platform-wide insights | Done |
| AI Resume Generator | ATS-friendly resume from profile | Done |
| AI Portfolio Generator | Personal portfolio website | Done |

### AI Systems

| AI System | Purpose | Model | Location |
|-----------|---------|-------|----------|
| AI Mentor | Career guidance, learning roadmaps, interview prep | Gemini API | `/ai/mentor` |
| AI Co-Founder | System architecture, DB design, sprint planning | Gemini API | `/ai/cofounder` |
| AI Chatbot | General queries, coding help, concept explanation | Gemini API | `/ai/chatbot` |

### ML Features

| Feature | Model | HuggingFace URL | Backend File |
|---------|-------|-----------------|--------------|
| Project Originality Check | all-MiniLM-L6-v2 | [Link](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) | `routes/ml.routes.ts` |
| Team Recommendation | all-MiniLM-L6-v2 | Same as above | `routes/ml.routes.ts` |
| Event Recommendation | Content-based filtering | N/A (algorithm-based) | `routes/ml.routes.ts` |
| Career Recommendation | RandomForest + XGBoost | Custom trained | `ml-service/train_models.py` |
| Placement Prediction | RandomForest + XGBoost | Custom trained | `ml-service/train_models.py` |
| AI Code Review | deepseek-coder-6.7b-instruct | [Link](https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-instruct) | `services/huggingface.service.ts` |
| Coding Arena AI Opponent | Qwen2.5-Coder-7B-Instruct | [Link](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct) | `services/huggingface.service.ts` |
| Semantic Search | bge-small-en-v1.5 | [Link](https://huggingface.co/BAAI/bge-small-en-v1.5) | `services/huggingface.service.ts` |

## Tech Stack

### Frontend (Web)
- React 19 + TypeScript + Vite
- Tailwind CSS + ShadCN UI (40+ components)
- Framer Motion (animations)
- Recharts (analytics charts)
- Zustand (state management)

### Mobile
- Flutter + Dart (structure provided)

### Backend
- Node.js + Express.js + TypeScript
- MongoDB Atlas (primary database)
- Socket.IO (real-time messaging)
- WebRTC (video/audio calls)
- JWT + Google OAuth (authentication)

### AI/ML
- Google Gemini API (3 AI systems)
- Hugging Face Inference API (6 models)
- Python ML microservice (scikit-learn, XGBoost)

### DevOps
- Docker (containerization)
- Vercel (frontend hosting)
- Render/AWS (backend hosting)
- PM2 (process management)

## Project Structure

```
projectverse-ai/
├── frontend/              # React Web App
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── pages/         # Page Components (25+ pages)
│   │   ├── types/         # TypeScript Types
│   │   ├── store/         # Zustand Store
│   │   ├── services/      # API Client & Mock Data
│   │   ├── layouts/       # Page Layouts
│   │   └── App.tsx        # Routes
│   ├── package.json
│   └── Dockerfile
├── backend/               # Node.js API Server
│   ├── src/
│   │   ├── routes/        # API Routes (14 modules)
│   │   ├── models/        # MongoDB Models (17 collections)
│   │   ├── services/      # AI Services (Gemini, HuggingFace)
│   │   ├── middleware/    # Auth, Validation, Error Handling
│   │   ├── config/        # Database, Socket, Logger
│   │   ├── server.ts      # Entry Point
│   │   └── app.ts         # Express App
│   ├── ml-service/        # Python ML Microservice
│   ├── package.json
│   └── Dockerfile
├── mobile/                # Flutter Mobile App
├── architecture/          # Architecture Documents
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Google AI Studio API key
- Hugging Face API token

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/projectverse-ai.git
cd projectverse-ai

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your API keys

# Frontend
cd ../frontend
# Create .env.local with:
# VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:3000
Backend API: http://localhost:5000

### 4. API Documentation

Once the backend is running, API docs are available at:
- Base URL: `http://localhost:5000/api/v1`
- Health Check: `GET /health`

### 5. Hugging Face Model Setup

**No training required** for pre-trained models. Just set your API token:

```bash
# In backend/.env
HUGGINGFACE_API_TOKEN=your_hf_token_here
```

Models are accessed via Hugging Face Inference API (serverless). No local GPU needed.

For **custom ML models** (Career/Placement prediction):

```bash
cd backend/ml-service
pip install -r requirements.txt
python train_models.py  # Trains on sample data
python app.py            # Starts ML microservice
```

### 6. Deploy with Docker

```bash
docker-compose up -d
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `HUGGINGFACE_API_TOKEN` | Yes | Hugging Face access token |
| `GOOGLE_CLIENT_ID` | For OAuth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For OAuth | Google OAuth client secret |
| `CLOUDINARY_*` | For uploads | Cloudinary credentials |
| `SMTP_PASS` | For email | SendGrid API key |

## GitHub Push Instructions

```bash
# Initialize git (if not already)
git init

# Add the frontend and backend separately
git add frontend/
git commit -m "feat: add React frontend with all modules"

git add backend/
git commit -m "feat: add Node.js backend with API and AI integration"

git add architecture/
git commit -m "docs: add architecture documentation"

git add mobile/
git commit -m "feat: add Flutter mobile structure"

# Push
git branch -M main
git remote add origin https://github.com/yourusername/projectverse-ai.git
git push -u origin main
```

## AI Model Integration Guide

### Where to Add Hugging Face Models

| Model | Integration File | How to Use |
|-------|-----------------|------------|
| all-MiniLM-L6-v2 | `backend/src/services/huggingface.service.ts` | `generateEmbeddings()` - Already integrated |
| bge-small-en-v1.5 | Same file, replace model name | Swap model URL for better search |
| deepseek-coder | `backend/src/services/huggingface.service.ts` | `reviewCode()` - Already integrated |
| Qwen2.5-Coder | Same file | `generateSolution()` - Already integrated |

### How to Train Custom Models

1. **Career Recommendation**: Edit `backend/ml-service/train_career_model.py`
   - Add your student dataset
   - Features: skills, projects, certifications, coding_score
   - Target: career_path (categorical)
   - Models: RandomForestClassifier + XGBoost

2. **Placement Prediction**: Edit `backend/ml-service/train_placement_model.py`
   - Features: projects, skills, cgpa, coding_score
   - Target: placement_readiness (0-100 score)
   - Models: RandomForestRegressor + XGBoost

## License

MIT License - See LICENSE file for details.

## Team

Built with by the ProjectVerse AI Team.
