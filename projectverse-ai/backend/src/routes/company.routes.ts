import { Router } from 'express';
import { Company } from '../models/Company.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { industry, hiring } = req.query;
  const filter: any = {};
  if (industry) filter['companyDetails.industry'] = industry;
  if (hiring === 'true') filter.hiringStatus = true;

  const companies = await Company.find(filter)
    .populate('userId', 'firstName lastName avatar')
    .sort('-createdAt');
  res.json({ success: true, data: companies });
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate('userId', 'firstName lastName avatar');
  if (!company) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Company not found' } });
    return;
  }
  res.json({ success: true, data: company });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const company = await Company.create({ ...req.body, userId: req.user._id });
  await company.populate('userId', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: company });
}));

export default router;
