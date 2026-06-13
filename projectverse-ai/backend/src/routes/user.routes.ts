import { Router } from 'express';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

// Get all users with filters
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { role, department, skills, year, page = 1, limit = 20 } = req.query;
  const filter: any = {};

  if (role) filter.role = role;
  if (department) filter['college.department'] = department;
  if (year) filter['college.yearOfStudy'] = Number(year);
  if (skills) filter['skills.name'] = { $in: (skills as string).split(',') };

  const users = await User.find(filter)
    .select('-password')
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit))
    .sort('-createdAt');

  const count = await User.countDocuments(filter);

  res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total: count, pages: Math.ceil(count / Number(limit)) } });
}));

// Get user by ID
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    return;
  }
  res.json({ success: true, data: user });
}));

// Update user
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const updates = req.body;
  delete updates.password;
  delete updates.role;

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
  res.json({ success: true, data: user });
}));

// Get user projects
router.get('/:id/projects', authenticate, asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.params.id }).populate('owner', 'firstName lastName avatar');
  res.json({ success: true, data: projects });
}));

// Search users
router.get('/search/query', authenticate, asyncHandler(async (req, res) => {
  const { q } = req.query;
  const users = await User.find({
    $or: [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { 'skills.name': { $regex: q, $options: 'i' } },
    ],
  }).select('-password').limit(20);
  res.json({ success: true, data: users });
}));

// Get leaderboard
router.get('/leaderboard/top', asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ 'scores.innovationScore': -1 }).limit(50);
  const leaderboard = users.map((u, i) => ({
    userId: u,
    innovationScore: u.scores?.innovationScore || 0,
    codingScore: u.scores?.codingRating || 0,
    contributionScore: u.scores?.contributionScore || 0,
    totalScore: (u.scores?.innovationScore || 0) + (u.scores?.codingRating || 0) + (u.scores?.contributionScore || 0),
    rank: i + 1,
  }));
  res.json({ success: true, data: leaderboard });
}));

export default router;
