import { Router } from 'express';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

// Get challenges
router.get('/challenges', authenticate, asyncHandler(async (req, res) => {
  const { difficulty, category } = req.query;
  const filter: any = {};
  if (difficulty) filter.difficulty = difficulty;
  if (category) filter.category = category;

  const challenges = await CodingChallenge.find(filter).select('-testCases');
  res.json({ success: true, data: challenges });
}));

// Get challenge by ID
router.get('/challenges/:id', authenticate, asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.findById(req.params id).select('-testCases.isHidden -testCases.expectedOutput');
  if (!challenge) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Challenge not found' } });
    return;
  }
  res.json({ success: true, data: challenge });
}));

// Submit solution
router.post('/challenges/:id/submit', authenticate, asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  const challenge = await CodingChallenge.findById(req.params.id);
  if (!challenge) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Challenge not found' } });
    return;
  }

  // Run test cases (mock execution)
  const testResults = challenge.testCases.map((tc: any) => ({
    testCaseId: tc._id,
    passed: true,
    actualOutput: tc.expectedOutput,
    executionTime: Math.floor(Math.random() * 100) + 20,
    memoryUsed: Math.floor(Math.random() * 20) + 5,
  }));

  const allPassed = testResults.every((r: any) => r.passed);
  const submission = await CodingSubmission.create({
    userId: req.user._id,
    challengeId: req.params.id,
    code,
    language,
    status: allPassed ? 'accepted' : 'wrong_answer',
    testCaseResults: testResults,
    executionTime: Math.max(...testResults.map((r: any) => r.executionTime)),
    memoryUsed: Math.max(...testResults.map((r: any) => r.memoryUsed)),
    score: allPassed ? challenge.points : 0,
  });

  // Update challenge stats
  challenge.totalSubmissions += 1;
  if (allPassed) challenge.totalAccepted += 1;
  challenge.acceptanceRate = Math.round((challenge.totalAccepted / challenge.totalSubmissions) * 100);
  await challenge.save();

  res.json({
    success: true,
    data: {
      submissionId: submission._id,
      status: submission.status,
      testCases: { total: testResults.length, passed: testResults.filter((r: any) => r.passed).length },
      executionTime: submission.executionTime,
      memoryUsed: submission.memoryUsed,
      score: submission.score,
    },
  });
}));

// Get leaderboard
router.get('/leaderboard', asyncHandler(async (_req, res) => {
  const users = await CodingSubmission.aggregate([
    { $match: { status: 'accepted' } },
    { $group: { _id: '$userId', totalScore: { $sum: '$score' }, problemsSolved: { $sum: 1 } } },
    { $sort: { totalScore: -1 } },
    { $limit: 50 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
  ]);
  res.json({ success: true, data: users });
}));

export default router;
