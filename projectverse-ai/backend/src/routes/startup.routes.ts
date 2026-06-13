import { Router } from 'express';
import { Startup } from '../models/Startup.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { stage, industry } = req.query;
  const filter: any = { status: 'active' };
  if (stage) filter.stage = stage;
  if (industry) filter.industry = industry;

  const startups = await Startup.find(filter)
    .populate('founderId', 'firstName lastName avatar')
    .populate('teamMembers.userId', 'firstName lastName avatar')
    .sort('-createdAt');
  res.json({ success: true, data: startups });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.id)
    .populate('founderId', 'firstName lastName avatar')
    .populate('teamMembers.userId', 'firstName lastName avatar');
  if (!startup) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Startup not found' } });
    return;
  }
  res.json({ success: true, data: startup });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const startup = await Startup.create({ ...req.body, founderId: req.user._id });
  await startup.populate('founderId', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: startup });
}));

export default router;
