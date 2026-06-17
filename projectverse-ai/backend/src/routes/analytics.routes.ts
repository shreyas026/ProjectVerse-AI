import { Router } from 'express';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Event } from '../models/Event.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

// Get dashboard stats
router.get('/dashboard', authenticate, authorize('admin'), asyncHandler(async (_req, res) => {
  const [totalUsers, totalProjects, totalEvents, activeUsers] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    Event.countDocuments(),
    User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
  ]);

  // Department stats
  const departmentStats = await User.aggregate([
    { $match: { 'college.department': { $exists: true } } },
    { $group: {
      _id: '$college.department',
      userCount: { $sum: 1 },
      avgCodingScore: { $avg: '$scores.codingRating' },
    }},
    { $project: { department: '$_id', userCount: 1, avgCodingScore: { $round: ['$avgCodingScore', 0] } } },
    { $sort: { userCount: -1 } },
  ]);

  // Monthly growth (last 6 months)
  const monthlyGrowth: Array<{ month: string; users: number; projects: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const [users, projects] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: start, $lt: end } }),
      Project.countDocuments({ createdAt: { $gte: start, $lt: end } }),
    ]);

    monthlyGrowth.push({
      month: date.toLocaleString('default', { month: 'short' }),
      users,
      projects,
    });
  }

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProjects,
      totalEvents,
      activeUsers,
      departmentStats,
      monthlyGrowth,
    },
  });
}));

// Get user stats
router.get('/users', authenticate, authorize('admin'), asyncHandler(async (_req, res) => {
  const roleDistribution = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);
  res.json({ success: true, data: { roleDistribution } });
}));

export default router;
