import { Router } from 'express';
import { ResearchOpportunity } from '../models/ResearchOpportunity.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { domain, status = 'open' } = req.query;
  const filter: any = { status };
  if (domain) filter.domain = domain;

  const research = await ResearchOpportunity.find(filter)
    .populate('facultyId', 'firstName lastName avatar');
  res.json({ success: true, data: research });
}));

router.post('/', authenticate, authorize('faculty', 'admin'), asyncHandler(async (req, res) => {
  const research = await ResearchOpportunity.create({ ...req.body, facultyId: req.user._id });
  await research.populate('facultyId', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: research });
}));

router.post('/:id/apply', authenticate, authorize('student'), asyncHandler(async (req, res) => {
  const { statement, resume } = req.body;
  const research = await ResearchOpportunity.findById(req.params.id);
  if (!research) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Research opportunity not found' } });
    return;
  }
  research.applications.push({
    studentId: req.user._id,
    statement,
    resume,
    status: 'pending',
    appliedAt: new Date(),
  });
  await research.save();
  res.json({ success: true, message: 'Application submitted' });
}));

export default router;
