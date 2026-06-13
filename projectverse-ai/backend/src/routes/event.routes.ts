import { Router } from 'express';
import { Event } from '../models/Event.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { type, status = 'published' } = req.query;
  const filter: any = { status };
  if (type) filter.type = type;

  const events = await Event.find(filter)
    .populate('organizer', 'firstName lastName avatar')
    .sort('startDate');
  res.json({ success: true, data: events });
}));

router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'firstName lastName avatar');
  if (!event) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Event not found' } });
    return;
  }
  res.json({ success: true, data: event });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, organizer: req.user._id, organizerType: req.user.role });
  await event.populate('organizer', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: event });
}));

router.post('/:id/register', authenticate, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Event not found' } });
    return;
  }
  if (event.currentParticipants >= event.maxParticipants) {
    res.status(400).json({ success: false, error: { code: 'FULL', message: 'Event is full' } });
    return;
  }
  event.currentParticipants += 1;
  await event.save();
  res.json({ success: true, message: 'Registered successfully' });
}));

export default router;
