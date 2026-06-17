# ProjectVerse AI - AI Architecture

## Overview
ProjectVerse AI integrates THREE dedicated AI systems plus EIGHT ML-powered features.

## Three AI Systems

### AI System 1: AI MENTOR
**Purpose**: Personal learning mentor for students
**Model**: Ollama (llama3.1:8b)
**Temperature**: 0.7 (balanced creativity)

#### Capabilities
- Career Guidance & Path Planning
- Personalized Learning Roadmaps
- Interview Preparation (Technical + HR)
- Technology Recommendations
- Project Guidance & Ideas
- Certification Suggestions
- Placement Preparation Strategy

#### System Prompt
```
You are ProjectVerse AI Mentor, a friendly and supportive educational assistant 
designed specifically for college students. Your personality is encouraging, 
patient, and knowledgeable. You provide actionable guidance with structured 
responses including roadmaps, resources, and timelines.

Always respond with:
1. Direct answer/guidance
2. Structured roadmap when applicable
3. Specific resources (courses, books, docs)
4. Timeline estimates
5. Encouragement
```

#### API Integration
```javascript
// File: backend/src/services/ollama.service.ts
import axios from 'axios';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const model = process.env.OLLAMA_CHAT_MODEL || 'llama3.1:8b';

export class OllamaService {
  async generateRoadmap(careerGoal: string, skills: string[], level: string) {
    const prompt = `Create a detailed learning roadmap for becoming a ${careerGoal}. 
    Current skills: ${skills.join(', ')}. Current level: ${level}.
    Include phases, specific skills, certifications, and project ideas.`;
    
    return this.generateResponse('mentor', prompt);
  }
  
  async generateInterviewPrep(topic: string, difficulty: string) {
    const prompt = `Generate ${difficulty} interview questions for ${topic} 
    with detailed answers and follow-up questions.`;
    
    return this.generateResponse('mentor', prompt);
  }
}
```

---

### AI System 2: AI CO-FOUNDER
**Purpose**: Startup co-founder and technical architect
**Model**: Ollama (llama3.1:8b)
**Temperature**: 0.3 (more deterministic)

#### Capabilities
- System Architecture Design
- Database Schema Generation
- API Design & Documentation
- Sprint Planning & Timeline
- Feature Prioritization
- Technology Stack Recommendations
- Risk Analysis & Mitigation
- Documentation Generation

#### System Prompt
```
You are ProjectVerse AI Co-Founder, a professional technical architect and startup 
advisor. You think strategically about product development, system design, and 
business viability. Your responses are structured, professional, and actionable.

You provide:
1. System architecture diagrams (text-based)
2. Database schemas with relationships
3. API specifications with endpoints
4. Sprint plans with story points
5. Risk matrices
6. Technical documentation
```

#### API Integration
```javascript
// File: backend/src/services/ai/cofounder.service.ts
export class AICoFounderService {
  async generateArchitecture(projectIdea: string, requirements: string[]) {
    const prompt = `Design a complete system architecture for: ${projectIdea}
    Requirements: ${requirements.join(', ')}
    
    Provide:
    1. High-level architecture diagram
    2. Component breakdown
    3. Technology stack with justifications
    4. Deployment strategy
    5. Scalability considerations`;
    
    const result = await model.generateContent(prompt);
    return this.parseArchitectureResponse(result.response.text());
  }
  
  async generateDatabaseSchema(projectIdea: string, features: string[]) {
    const prompt = `Design a MongoDB database schema for: ${projectIdea}
    Features: ${features.join(', ')}
    
    Provide collections, fields, types, indexes, and relationships.`;
    
    const result = await model.generateContent(prompt);
    return this.parseDatabaseSchema(result.response.text());
  }
  
  async generateSprintPlan(features: string[], teamSize: number, duration: number) {
    const prompt = `Create a sprint plan for ${teamSize} developers over ${duration} weeks.
    Features: ${features.join(', ')}
    
    Provide sprints with story points, dependencies, and milestones.`;
    
    const result = await model.generateContent(prompt);
    return this.parseSprintPlan(result.response.text());
  }
}
```

---

### AI System 3: AI CHATBOT
**Purpose**: General-purpose conversational assistant
**Model**: Ollama (llama3.1:8b)
**Temperature**: 0.9 (more creative)

#### Capabilities
- Answer General Questions
- Explain Technical Concepts
- Coding Help & Debugging
- Project Help & Ideas
- College-related Queries
- Resource Recommendations

#### System Prompt
```
You are ProjectVerse AI Assistant, a friendly and knowledgeable chatbot for college 
students. You can help with coding, concepts, projects, and general queries. 
You respond quickly, use examples, and keep responses concise but complete.
```

---

## Eight ML Features

### ML Feature 1: PROJECT ORIGINALITY CHECKER

**Model**: sentence-transformers/all-MiniLM-L6-v2
**Source**: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
**Vector Dimension**: 384
**Metric**: Cosine Similarity

#### Implementation
```
1. Generate embeddings for input project (title + description + tech stack)
2. Fetch existing project embeddings from MongoDB
3. Calculate cosine similarity between input and all existing projects
4. Return originality score + similar projects + improvement suggestions
```

#### Code Location: `backend/src/services/ml/originality-checker.service.ts`

```javascript
import { pipeline } from '@xenova/transformers';

class OriginalityCheckerService {
  private embedder: any;
  
  async initialize() {
    // Load model from Hugging Face
    this.embedder = await pipeline(
      'feature-extraction', 
      'Xenova/all-MiniLM-L6-v2'
    );
  }
  
  async checkOriginality(projectData: ProjectData) {
    // 1. Generate embedding for new project
    const text = `${projectData.title} ${projectData.description} ${projectData.technologies.join(' ')}`;
    const embedding = await this.embedder(text, { pooling: 'mean', normalize: true });
    
    // 2. Query MongoDB for similar projects using vector search
    const similarProjects = await Project.aggregate([
      {
        $vectorSearch: {
          index: 'project_vector_index',
          path: 'embedding',
          queryVector: embedding[0],
          numCandidates: 10,
          limit: 5
        }
      }
    ]);
    
    // 3. Calculate originality score
    const maxSimilarity = Math.max(...similarProjects.map(p => p.score));
    const originalityScore = Math.round((1 - maxSimilarity) * 100);
    
    return {
      originalityScore,
      isOriginal: originalityScore > 60,
      similarProjects: similarProjects.map(p => ({
        projectId: p._id,
        title: p.title,
        similarityScore: p.score,
        owner: p.owner
      }))
    };
  }
}
```

#### How to Train
```bash
# The model is pre-trained, no training needed
# Just download and use:
npm install @xenova/transformers

# First run will auto-download the model from Hugging Face
# Model cached at: ~/.cache/huggingface/hub/
```

---

### ML Feature 2: TEAM RECOMMENDATION ENGINE

**Model**: sentence-transformers/all-MiniLM-L6-v2
**Algorithm**: Cosine Similarity on skill embeddings
**Source**: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2

#### Implementation
```
Input: Student skills, interests, projects, department
Process: 
  1. Create student embedding from profile data
  2. Find teams with complementary skill embeddings
  3. Calculate compatibility score
  4. Filter by department preferences and availability
Output: Recommended teams with compatibility scores
```

#### Code Location: `backend/src/services/ml/team-recommendation.service.ts`

```javascript
class TeamRecommendationService {
  async getRecommendations(userId: string) {
    const user = await User.findById(userId);
    const userEmbedding = user.embedding;
    
    // Find open teams needing the user's skills
    const openTeams = await Team.find({ 
      'requirements.isOpen': true 
    });
    
    // Calculate compatibility for each team
    const recommendations = openTeams.map(team => {
      const similarity = cosineSimilarity(userEmbedding, team.skillEmbedding);
      const skillMatch = this.calculateSkillMatch(user.skills, team.requirements.skillsNeeded);
      const compatibilityScore = (similarity * 0.4 + skillMatch * 0.6) * 100;
      
      return {
        teamId: team._id,
        teamName: team.name,
        compatibilityScore: Math.round(compatibilityScore),
        matchedSkills: this.getMatchedSkills(user.skills, team.requirements.skillsNeeded),
        reason: this.generateReason(user, team)
      };
    });
    
    return recommendations
      .filter(r => r.compatibilityScore > 50)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10);
  }
}
```

---

### ML Feature 3: EVENT RECOMMENDATION ENGINE

**Algorithm**: Content-Based Filtering
**Input**: User interests, skills, past event attendance
**Output**: Recommended events sorted by relevance

#### Code Location: `backend/src/services/ml/event-recommendation.service.ts`

```javascript
class EventRecommendationService {
  async getRecommendations(userId: string) {
    const user = await User.findById(userId);
    const pastEvents = await EventRegistration.find({ userId })
      .populate('eventId');
    
    // Get upcoming events
    const upcomingEvents = await Event.find({
      startDate: { $gt: new Date() },
      status: 'published'
    });
    
    // Calculate relevance score for each event
    const recommendations = upcomingEvents.map(event => {
      let score = 0;
      
      // Skill match (40%)
      const skillMatch = this.calculateSkillOverlap(user.skills, event.technologies);
      score += skillMatch * 0.4;
      
      // Interest match (30%)
      const interestMatch = this.calculateInterestOverlap(user.interests, event.tags);
      score += interestMatch * 0.3;
      
      // Past attendance pattern (20%)
      const typePreference = this.calculateTypePreference(pastEvents, event.type);
      score += typePreference * 0.2;
      
      // Recency boost (10%)
      const recencyBoost = this.calculateRecencyBoost(event.startDate);
      score += recencyBoost * 0.1;
      
      return {
        eventId: event._id,
        title: event.title,
        relevanceScore: Math.round(score * 100),
        reasons: this.generateReasons(user, event)
      };
    });
    
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
  }
}
```

---

### ML Feature 4: CAREER RECOMMENDATION ENGINE

**Models**: RandomForestClassifier, XGBoost
**Input**: Skills, projects, certifications, coding activity
**Output**: Recommended career paths (AI Engineer, Data Scientist, Full Stack Dev, etc.)

#### Code Location: `backend/src/services/ml/career-recommendation.service.ts`

```javascript
// Python microservice for ML models
// File: backend/ml-service/app.py

from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load pre-trained models
rf_model = joblib.load('models/career_rf_model.pkl')
xgb_model = joblib.load('models/career_xgb_model.pkl')

@app.route('/predict/career', methods=['POST'])
def predict_career():
    data = request.json
    
    # Feature engineering
    features = extract_features(data)
    
    # Predict with both models
    rf_pred = rf_model.predict_proba(features)
    xgb_pred = xgb_model.predict_proba(features)
    
    # Ensemble (average)
    final_pred = (rf_pred + xgb_pred) / 2
    
    # Get top 3 careers
    career_labels = ['AI Engineer', 'Data Scientist', 'Full Stack Developer', 
                     'DevOps Engineer', 'Mobile Developer', 'Cybersecurity Expert']
    top_careers = get_top_predictions(final_pred, career_labels, n=3)
    
    return jsonify({
        'recommendations': top_careers,
        'confidence': float(np.max(final_pred))
    })

def extract_features(data):
    # Convert user data to feature vector
    # Skills encoded, project count, coding score, certifications count, etc.
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
```

#### How to Train
```bash
# Training script: backend/ml-service/train_career_model.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

# 1. Prepare training data
data = pd.read_csv('data/student_career_data.csv')

# Features: skills (one-hot encoded), project_count, coding_score, 
#           certifications_count, github_commits, etc.
X = data[['project_count', 'coding_score', 'certifications_count', 
          'github_commits', 'problems_solved', 'has_ml_project', 
          'has_web_project', 'has_mobile_project', 'has_cloud_project',
          'internship_count', 'hackathon_wins']]

# Target: career path
y = data['career_path']

# 2. Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# 3. Split data
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2)

# 4. Train Random Forest
rf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
rf.fit(X_train, y_train)

# 5. Train XGBoost
xgb = XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1)
xgb.fit(X_train, y_train)

# 6. Save models
joblib.dump(rf, 'models/career_rf_model.pkl')
joblib.dump(xgb, 'models/career_xgb_model.pkl')
joblib.dump(le, 'models/career_label_encoder.pkl')

print(f"RF Accuracy: {rf.score(X_test, y_test):.3f}")
print(f"XGB Accuracy: {xgb.score(X_test, y_test):.3f}")
```

---

### ML Feature 5: PLACEMENT PREDICTION ENGINE

**Models**: Random Forest, XGBoost
**Input**: Projects, skills, certifications, coding rating
**Output**: Placement Readiness Score (0-100)

#### Code Location: `backend/src/services/ml/placement-prediction.service.ts`

```python
# Python microservice: backend/ml-service/placement.py

@app.route('/predict/placement', methods=['POST'])
def predict_placement():
    data = request.json
    
    features = np.array([[
        data['project_count'],
        data['coding_score'],
        data['certifications_count'],
        data['problems_solved'],
        data['github_commits'],
        data['internship_count'],
        data['hackathon_wins'],
        data['cgpa'],
        data['contribution_score']
    ]]).reshape(1, -1)
    
    # Predict readiness score
    rf_score = rf_placement.predict(features)[0]
    xgb_score = xgb_placement.predict(features)[0]
    
    # Average ensemble
    final_score = (rf_score + xgb_score) / 2
    
    # Generate improvement suggestions using Gemini
    suggestions = generate_improvement_suggestions(data, final_score)
    
    return jsonify({
        'readinessScore': round(final_score, 1),
        'isReady': final_score > 75,
        'suggestions': suggestions,
        'category': 'Ready' if final_score > 75 else 'Needs Improvement' if final_score > 50 else 'Not Ready'
    })
```

---

### ML Feature 6: AI CODE REVIEWER

**Model**: Ollama (codellama:7b)
**Features**: Bug Detection, Code Quality Analysis, Complexity Analysis, Optimization Suggestions

#### Code Location: `backend/src/services/ollama.service.ts`

```javascript
class OllamaService {
  async reviewCode(code: string, language: string) {
    const prompt = `Review the following ${language} code and provide:
1. Bug detection (list any bugs found)
2. Code quality score (0-100)
3. Time complexity analysis
4. Space complexity analysis
5. Optimization suggestions

Code:
\`\`\`${language}
${code}
\`\`\``;

    return this.generateResponse('code', prompt);
  }
}
```

---

### ML Feature 7: CODING ARENA AI OPPONENT

**Model**: Ollama (codellama:7b)
**Features**: Compete with students, generate solutions, explain solutions

#### Code Location: `backend/src/services/ollama.service.ts`

```javascript
class OllamaService {
  async generateSolution(problem: string, language: string) {
    const prompt = `Solve this coding problem in ${language} with detailed comments:

${problem}`;

    return this.generateResponse('code', prompt);
  }
}
```

---

### ML Feature 8: SEMANTIC SEARCH ENGINE

**Model**: BAAI/bge-small-en-v1.5
**Source**: https://huggingface.co/BAAI/bge-small-en-v1.5
**Vector Dimension**: 384
**Used For**: Project Search, Student Search, Event Search, Skill Search

#### Code Location: `backend/src/services/ml/semantic-search.service.ts`

```javascript
class SemanticSearchService {
  private embedder: any;
  
  async initialize() {
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/bge-small-en-v1.5'
    );
  }
  
  async searchProjects(query: string, filters: any = {}) {
    // Generate query embedding
    const queryEmbedding = await this.embedder(query, { 
      pooling: 'mean', 
      normalize: true 
    });
    
    // Vector search in MongoDB
    const results = await Project.aggregate([
      {
        $vectorSearch: {
          index: 'project_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding[0],
          numCandidates: 100,
          limit: 20
        }
      },
      {
        $match: filters // Apply additional filters
      },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          owner: 1,
          technologies: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]);
    
    return results;
  }
  
  async searchStudents(query: string) {
    const queryEmbedding = await this.embedder(query, { 
      pooling: 'mean', 
      normalize: true 
    });
    
    return await User.aggregate([
      {
        $vectorSearch: {
          index: 'user_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding[0],
          numCandidates: 50,
          limit: 20
        }
      }
    ]);
  }
}
```

---

### AI Feature 9: AI RESUME GENERATOR

**Model**: Ollama (llama3.1:8b)
**Input**: User profile data (skills, projects, certifications, achievements)
**Output**: ATS-Friendly Resume (HTML)

#### Code Location: `backend/src/services/ollama.service.ts`

```javascript
class OllamaService {
  async generateResume(userData: any) {
    const prompt = `Generate an ATS-friendly HTML resume for candidate.
    Use proper HTML with inline CSS for ATS compatibility.`;
    
    return this.generateResponse('mentor', prompt);
  }
}
```

---

### AI Feature 10: AI PORTFOLIO GENERATOR

**Model**: Ollama (llama3.1:8b)
**Input**: User profile + projects
**Output**: Complete portfolio website (HTML/CSS/JS)

#### Code Location: `backend/src/services/ollama.service.ts`

```javascript
class OllamaService {
  async generatePortfolio(userData: any) {
    const prompt = `Create a stunning personal portfolio website as a single HTML file candidate.
    Use modern CSS with animations. Make it responsive.`;
    
    return this.generateResponse('mentor', prompt);
  }
}
```

---

## Hugging Face Model Summary

| Feature | Model | Host / Library | Integration Type | Code Location |
|---------|-------|--------|-----------------|---------------|
| Project Originality | all-MiniLM-L6-v2 | Local (Xenova) | Local CPU Inference | `ml/originality-checker.service.ts` |
| Team Recommendation | all-MiniLM-L6-v2 | Local (Xenova) | Local CPU Inference | `ml/team-recommendation.service.ts` |
| Semantic Search | bge-small-en-v1.5 | Local (Xenova) | Local CPU Inference | `ml/semantic-search.service.ts` |
| AI Code Review | codellama:7b | Ollama | Local LLM Inference | `services/ollama.service.ts` |
| Coding Opponent | codellama:7b | Ollama | Local LLM Inference | `services/ollama.service.ts` |
| Career Prediction | RandomForest + XGBoost | Python Flask | Microservice (Port 7001) | `ml-service/app.py` |
| Placement Prediction | RandomForest + XGBoost | Python Flask | Microservice (Port 7001) | `ml-service/app.py` |
| AI Mentor | llama3.1:8b | Ollama | Local LLM Inference | `services/ollama.service.ts` |
| AI Co-Founder | llama3.1:8b | Ollama | Local LLM Inference | `services/ollama.service.ts` |
| AI Chatbot | llama3.1:8b | Ollama | Local LLM Inference | `services/ollama.service.ts` |
| Resume Generator | llama3.1:8b | Ollama | Local LLM Inference | `services/ollama.service.ts` |
| Portfolio Generator | llama3.1:8b | Ollama | Local LLM Inference | `services/ollama.service.ts` |

---

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama3.1:8b
OLLAMA_CODE_MODEL=codellama:7b
OLLAMA_EMBED_MODEL=nomic-embed-text

# ML Service
ML_SERVICE_URL=http://localhost:7001
```

## Architecture Diagram

```
+--------------------------------------------------------+
|                    CLIENT REQUEST                       |
+--------------------------------------------------------+
                          |
                          v
+--------------------------------------------------------+
|              API GATEWAY (Node.js/Express)              |
+--------------------------------------------------------+
                          |
        +-----------------+-----------------+
        |                 |                 |
        v                 v                 v
+------------+    +------------+    +------------+
|   Ollama   |    |   Xenova   |    |   Python   |
|   Server   |    |Transformrs |    |    ML      |
| (Local LLM |    | (Local CPU |    |  Service   |
|  Inference)|    | Embeddings)|    | (Port 7001)|
+------------+    +------------+    +------------+
        |                 |                 |
        +-----------------+-----------------+
                          |
                          v
+--------------------------------------------------------+
|                      MONGODB ATLAS                     |
+--------------------------------------------------------+
```
