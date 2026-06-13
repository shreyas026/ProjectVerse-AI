import { Router } from 'express';
import { Team } from '../models/Team.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const teams = await Team.find({ status: { $ne: 'disbanded' } })
    .populate('leader', 'firstName lastName avatar')
    .populate('members.userId', 'firstName lastName avatar')
    .populate('projectId', 'title');
  res.json({ success: true, data: teams });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const team = await Team.create({ ...req.body, leader: req.user._id, members: [{ userId: req.user._id, role: 'Leader' }] });
  await team.populate('leader', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: team });
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('leader', 'firstName lastName avatar')
    .populate('members.userId', 'firstName lastName avatar');
  res.json({ success: true, data: team });
}));

router.post('/:id/apply', authenticate, asyncHandler(async (req, res) => {
  // TODO: Implement team application logic
  res.json({ success: true, message: 'Application submitted' });
}));

export default router;
