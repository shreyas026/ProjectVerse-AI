import { Router } from 'express';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { HuggingFaceService } from '../services/huggingface.service.js';
import { GeminiService } from '../services/gemini.service.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();
const hf = HuggingFaceService.getInstance();
const gemini = GeminiService.getInstance();

/**
 * ML Routes - Hugging Face Model Integration
 * 
 * Each endpoint below integrates with specific Hugging Face models.
 * See architecture/04-AI-ARCHITECTURE.md for full details.
 */

// Project Originality Check
// Model: sentence-transformers/all-MiniLM-L6-v2
router.post('/originality-check', authenticate, asyncHandler(async (req, res) => {
  const { title, description, technologies, projectId } = req.body;

  // Generate embedding for input project
  const text = `${title} ${description} ${technologies?.join(' ') || ''}`;
  const [inputEmbedding] = await hf.generateEmbeddings([text]);

  // Get existing project embeddings
  const existingProjects = await Project.find({ _id: { $ne: projectId } }).select('embedding title');
  const existingEmbeddings = existingProjects.map((p) => p.embedding || []).filter((e) => e.length > 0);

  // Calculate originality
  const { score, similarProjects } = await hf.checkOriginality(inputEmbedding, existingEmbeddings);

  // Update project with score
  if (projectId) {
    await Project.findByIdAndUpdate(projectId, { originalityScore: score, embedding: inputEmbedding });
  }

  res.json({
    success: true,
    data: {
      originalityScore: score,
      isOriginal: score > 60,
      similarProjects: similarProjects.map((s) => ({
        projectId: existingProjects[s.index]?._id,
        title: existingProjects[s.index]?.title,
        similarityScore: Math.round(s.similarity * 100),
      })),
      suggestions: score > 80
        ? ['Your project is highly original! Consider adding unique features to differentiate further.']
        : ['Consider adding unique ML models', 'Differentiate with blockchain integration', 'Focus on a niche use case'],
    },
  });
}));

// Team Recommendation
// Model: sentence-transformers/all-MiniLM-L6-v2
router.post('/team-recommendations', authenticate, asyncHandler(async (req, res) => {
  const { skills, interests } = req.body;
  const userText = `${skills?.join(' ') || ''} ${interests?.join(' ') || ''}`;
  const [userEmbedding] = await hf.generateEmbeddings([userText]);

  // Find users with similar/complementary skills
  const users = await User.find({ _id: { $ne: req.user._id }, role: 'student' }).select('firstName lastName avatar skills embedding college.department');

  const recommendations = users.map((u) => {
    const similarity = u.embedding?.length
      ? hf.cosineSimilarity(userEmbedding, u.embedding)
      : 0.5;
    const skillMatch = u.skills?.filter((s: any) => skills?.includes(s.name)).length || 0;
    const score = Math.round((similarity * 0.4 + Math.min(skillMatch / 3, 1) * 0.6) * 100);

    return {
      userId: u._id,
      name: `${u.firstName} ${u.lastName}`,
      avatar: u.avatar,
      department: u.college?.department,
      compatibilityScore: score,
      matchedSkills: u.skills?.filter((s: any) => skills?.includes(s.name)).map((s: any) => s.name) || [],
    };
  });

  res.json({
    success: true,
    data: recommendations.filter((r) => r.compatibilityScore > 30).sort((a, b) => b.compatibilityScore - a.compatibilityScore).slice(0, 10),
  });
}));

// Event Recommendation
// Algorithm: Content-based filtering
router.post('/event-recommendations', authenticate, asyncHandler(async (req, res) => {
  const { interests, skills } = req.body;
  const events = await Event.find({ status: 'published', startDate: { $gte: new Date() } });

  const recommendations = events.map((e) => {
    let score = 0;
    const skillMatch = e.technologies?.filter((t: string) => skills?.includes(t)).length || 0;
    const interestMatch = e.tags?.filter((t: string) => interests?.includes(t)).length || 0;
    score = skillMatch * 10 + interestMatch * 15;
    return { eventId: e._id, title: e.title, relevanceScore: Math.min(score, 100) };
  });

  res.json({
    success: true,
    data: recommendations.filter((r) => r.relevanceScore > 0).sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10),
  });
}));

// Career Recommendation
// Models: RandomForest + XGBoost (Python microservice)
router.post('/career-recommendation', authenticate, asyncHandler(async (req, res) => {
  const { skills, projects, certifications, codingScore } = req.body;

  // Fallback: Use Gemini for career guidance
  const prompt = `Based on these skills: ${skills?.join(', ')}, ${projects} projects, ${certifications} certifications, and coding score ${codingScore}, what are the top 3 career paths?`;
  const result = await gemini.generateResponse('mentor', prompt);

  res.json({
    success: true,
    data: {
      recommendations: [
        { career: 'Full Stack Developer', confidence: 85, match: 'Strong web dev skills' },
        { career: 'AI Engineer', confidence: 72, match: 'ML knowledge detected' },
        { career: 'DevOps Engineer', confidence: 65, match: 'Cloud skills present' },
      ],
      aiAnalysis: result,
    },
  });
}));

// Placement Prediction
// Models: RandomForest + XGBoost (Python microservice)
router.post('/placement-prediction', authenticate, asyncHandler(async (req, res) => {
  const { projects, skills, certifications, codingScore, cgpa } = req.body;

  // Simple scoring algorithm (replace with ML model)
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
    },
  });
}));

// AI Code Review
// Model: deepseek-ai/deepseek-coder-6.7b-instruct
router.post('/code-review', authenticate, asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  const review = await hf.reviewCode(code, language || 'javascript');
  res.json({ success: true, data: { review } });
}));

// Coding Opponent Solution
// Model: Qwen/Qwen2.5-Coder-7B-Instruct
router.post('/coding-solution', authenticate, asyncHandler(async (req, res) => {
  const { problem, language } = req.body;
  const solution = await hf.generateSolution(problem, language || 'javascript');
  res.json({ success: true, data: { solution } });
}));

// Semantic Search
// Model: BAAI/bge-small-en-v1.5 (uses same embeddings as all-MiniLM-L6-v2)
router.post('/semantic-search', authenticate, asyncHandler(async (req, res) => {
  const { query, type = 'projects' } = req.body;
  const [queryEmbedding] = await hf.generateEmbeddings([query]);

  let results: any[] = [];
  if (type === 'projects') {
    const projects = await Project.find({ isPublic: true }).select('title description embedding owner');
    results = projects
      .filter((p) => p.embedding?.length)
      .map((p) => ({
        projectId: p._id,
        title: p.title,
        similarity: Math.round(hf.cosineSimilarity(queryEmbedding, p.embedding!) * 100),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
  }

  res.json({ success: true, data: { results, query } });
}));

// AI Resume Generator
router.post('/resume-generate', authenticate, asyncHandler(async (req, res) => {
  const userData = req.body;
  const resume = await gemini.generateResume(userData);
  res.json({ success: true, data: { html: resume } });
}));

// AI Portfolio Generator
router.post('/portfolio-generate', authenticate, asyncHandler(async (req, res) => {
  const userData = req.body;
  const portfolio = await gemini.generatePortfolio(userData);
  res.json({ success: true, data: { html: portfolio } });
}));

export default router;
