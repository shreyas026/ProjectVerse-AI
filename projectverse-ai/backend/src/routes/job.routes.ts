import { Router } from 'express';
import { JobPosting } from '../models/JobPosting.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { type, skills, page = 1, limit = 20 } = req.query;
  const filter: any = { status: 'active' };
  if (type) filter.type = type;
  if (skills) filter['skillsRequired.skill'] = { $in: (skills as string).split(',') };

  const jobs = await JobPosting.find(filter)
    .populate('companyId', 'companyDetails.name companyDetails.logo')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  res.json({ success: true, data: jobs });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const job = await JobPosting.create({ ...req.body, postedBy: req.user._id });
  await job.populate('companyId', 'companyDetails.name companyDetails.logo');
  res.status(201).json({ success: true, data: job });
}));

router.post('/:id/apply', authenticate, asyncHandler(async (req, res) => {
  const job = await JobPosting.findById(req.params.id);
  if (!job) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Job not found' } });
    return;
  }
  job.currentApplicants += 1;
  await job.save();
  res.json({ success: true, message: 'Application submitted successfully' });
}));

export default router;
