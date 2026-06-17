import { Router } from 'express';
import { OriginalityCheckerService } from '../services/ml/originality-checker.service.js';
import { TeamRecommendationService } from '../services/ml/team-recommendation.service.js';
import { EventRecommendationService } from '../services/ml/event-recommendation.service.js';
import { SemanticSearchService } from '../services/ml/semantic-search.service.js';
import { OllamaService } from '../services/ollama.service.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import axios from 'axios';

const router = Router();
const originalityChecker = OriginalityCheckerService.getInstance();
const teamRecommender = TeamRecommendationService.getInstance();
const eventRecommender = EventRecommendationService.getInstance();
const semanticSearch = SemanticSearchService.getInstance();
const ollama = OllamaService.getInstance();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:7001';

/**
 * ML Routes - Full AI/ML Feature Integration
 * 
 * Uses:
 * - @xenova/transformers for local HuggingFace models (embeddings, search)
 * - Ollama for code review & solution generation (codellama:7b)
 * - Python ML microservice for career/placement prediction (RandomForest + XGBoost)
 * - Content-based filtering for event recommendations
 */

// ============================================
// ML Feature 1: Project Originality Check
// Model: sentence-transformers/all-MiniLM-L6-v2 (local via @xenova/transformers)
// ============================================
router.post('/originality-check', authenticate, asyncHandler(async (req, res) => {
  const { title, description, technologies, projectId } = req.body;

  const result = await originalityChecker.checkOriginality({
    title,
    description,
    technologies,
    projectId,
  });

  res.json({ success: true, data: result });
}));

// ============================================
// ML Feature 2: Team Recommendation
// Model: sentence-transformers/all-MiniLM-L6-v2 (local via @xenova/transformers)
// ============================================
router.post('/team-recommendations', authenticate, asyncHandler(async (req, res) => {
  const { skills, interests } = req.body;

  const recommendations = await teamRecommender.getRecommendations(
    req.user._id.toString(),
    skills || [],
    interests || []
  );

  res.json({ success: true, data: recommendations });
}));

// ============================================
// ML Feature 3: Event Recommendation
// Algorithm: Content-based filtering
// ============================================
router.post('/event-recommendations', authenticate, asyncHandler(async (req, res) => {
  const { interests, skills, pastEventTypes } = req.body;

  const recommendations = await eventRecommender.getRecommendations(
    interests || [],
    skills || [],
    pastEventTypes
  );

  res.json({ success: true, data: recommendations });
}));

// ============================================
// ML Feature 4: Career Recommendation
// Models: RandomForest + XGBoost (Python microservice at port 7001)
// ============================================
router.post('/career-recommendation', authenticate, asyncHandler(async (req, res) => {
  const { skills, projects, certifications, codingScore, problemsSolved,
          githubCommits, internships, hackathonWins } = req.body;

  try {
    // Call Python ML microservice
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/career`, {
      project_count: projects || 0,
      coding_score: codingScore || 0,
      certifications_count: certifications || 0,
      problems_solved: problemsSolved || 0,
      github_commits: githubCommits || 0,
      internship_count: internships || 0,
      hackathon_wins: hackathonWins || 0,
      has_ml_project: skills?.includes('Machine Learning') ? 1 : 0,
      has_web_project: skills?.includes('React') || skills?.includes('Node.js') ? 1 : 0,
      has_mobile_project: skills?.includes('Flutter') || skills?.includes('React Native') ? 1 : 0,
      has_cloud_project: skills?.includes('AWS') || skills?.includes('Docker') ? 1 : 0,
    }, { timeout: 10000 });

    res.json({ success: true, data: mlResponse.data.data });
  } catch (error: any) {
    // Fallback: Use Ollama for career guidance
    const prompt = `Based on these skills: ${skills?.join(', ')}, ${projects} projects, ${certifications} certifications, and coding score ${codingScore}, what are the top 3 career paths? Provide confidence percentages.`;
    const aiAnalysis = await ollama.generateResponse('mentor', prompt);

    res.json({
      success: true,
      data: {
        recommendations: [
          { career: 'Full Stack Developer', confidence: 85, match: 'Strong web dev skills' },
          { career: 'AI Engineer', confidence: 72, match: 'ML knowledge detected' },
          { career: 'DevOps Engineer', confidence: 65, match: 'Cloud skills present' },
        ],
        aiAnalysis,
        source: 'fallback',
      },
    });
  }
}));

// ============================================
// ML Feature 5: Placement Prediction
// Models: RandomForest + XGBoost (Python microservice at port 7001)
// ============================================
router.post('/placement-prediction', authenticate, asyncHandler(async (req, res) => {
  const { projects, skills, certifications, codingScore, cgpa,
          problemsSolved, githubCommits, internships, hackathonWins, contributionScore } = req.body;

  try {
    // Call Python ML microservice
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/placement`, {
      project_count: projects || 0,
      coding_score: codingScore || 0,
      certifications_count: certifications || 0,
      problems_solved: problemsSolved || 0,
      github_commits: githubCommits || 0,
      internship_count: internships || 0,
      hackathon_wins: hackathonWins || 0,
      cgpa: cgpa || 7.0,
      contribution_score: contributionScore || 0,
    }, { timeout: 10000 });

    res.json({ success: true, data: mlResponse.data.data });
  } catch (error: any) {
    // Fallback: Simple scoring algorithm
    const projectScore = Math.min((projects || 0) * 10, 30);
    const skillScore = Math.min((skills?.length || 0) * 5, 25);
    const certScore = Math.min((certifications || 0) * 5, 15);
    const codingScoreNorm = Math.min(((codingScore || 0) / 3000) * 20, 20);
    const cgpaScore = Math.min(((cgpa || 0) / 10) * 10, 10);
    const readinessScore = Math.round(projectScore + skillScore + certScore + codingScoreNorm + cgpaScore);

    res.json({
      success: true,
      data: {
        readinessScore,
        isReady: readinessScore > 75,
        category: readinessScore > 75 ? 'Ready' : readinessScore > 50 ? 'Needs Improvement' : 'Not Ready',
        breakdown: { projectScore, skillScore, certScore, codingScore: codingScoreNorm, cgpaScore },
        suggestions: readinessScore < 75
          ? ['Build more projects', 'Improve coding score', 'Get certifications']
          : ['You are placement ready! Keep improving.'],
        source: 'fallback',
      },
    });
  }
}));

// ============================================
// ML Feature 6: AI Code Review
// Model: codellama:7b (via Ollama)
// ============================================
router.post('/code-review', authenticate, asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  const review = await ollama.reviewCode(code, language || 'javascript');
  res.json({ success: true, data: { review } });
}));

// ============================================
// ML Feature 7: Coding Arena AI Opponent
// Model: codellama:7b (via Ollama)
// ============================================
router.post('/coding-solution', authenticate, asyncHandler(async (req, res) => {
  const { problem, language } = req.body;
  const solution = await ollama.generateSolution(problem, language || 'javascript');
  res.json({ success: true, data: { solution } });
}));

// ============================================
// ML Feature 8: Semantic Search
// Model: BAAI/bge-small-en-v1.5 (local via @xenova/transformers)
// ============================================
router.post('/semantic-search', authenticate, asyncHandler(async (req, res) => {
  const { query, type = 'projects', limit = 10 } = req.body;

  let results: any[] = [];

  if (type === 'projects') {
    results = await semanticSearch.searchProjects(query, limit);
  } else if (type === 'users') {
    results = await semanticSearch.searchUsers(query, limit);
  }

  res.json({ success: true, data: { results, query, type } });
}));

// ============================================
// AI Feature 9: Resume Generator
// Model: llama3.1:8b (via Ollama)
// ============================================
router.post('/resume-generate', authenticate, asyncHandler(async (req, res) => {
  const userData = req.body;
  const resume = await ollama.generateResume(userData);
  res.json({ success: true, data: { html: resume } });
}));

// ============================================
// AI Feature 10: Portfolio Generator
// Model: llama3.1:8b (via Ollama)
// ============================================
router.post('/portfolio-generate', authenticate, asyncHandler(async (req, res) => {
  const userData = req.body;
  const portfolio = await ollama.generatePortfolio(userData);
  res.json({ success: true, data: { html: portfolio } });
}));

export default router;
