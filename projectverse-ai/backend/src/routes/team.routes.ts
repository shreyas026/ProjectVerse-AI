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

import { Notification } from '../models/Notification.js';

router.post('/:id/apply', authenticate, asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Team not found' } });
    return;
  }

  const userId = req.user._id;
  const isMember = team.members.some(m => m.userId.toString() === userId.toString());
  if (isMember) {
    res.status(400).json({ success: false, error: { code: 'ALREADY_MEMBER', message: 'You are already a member of this team' } });
    return;
  }

  // Create a notification for the team leader
  await Notification.create({
    recipient: team.leader,
    type: 'team_invite',
    title: 'New Team Application',
    message: `${req.user.firstName} ${req.user.lastName} has applied to join your team: ${team.name}.`,
    entityType: 'Team',
    entityId: team._id,
    link: `/teams/${team._id}`,
  });

  res.json({ success: true, message: 'Application submitted successfully' });
}));

export default router;
