import { Router } from 'express';
import { Project } from '../models/Project.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

// Get all projects (public)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { category, status, search, page = 1, limit = 20 } = req.query;
  const filter: any = { isPublic: true };

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    filter.$text = { $search: search as string };
  }

  const projects = await Project.find(filter)
    .populate('owner', 'firstName lastName avatar')
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit))
    .sort('-createdAt');

  const count = await Project.countDocuments(filter);
  res.json({ success: true, data: projects, pagination: { page: Number(page), limit: Number(limit), total: count } });
}));

// Get project by ID
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('owner', 'firstName lastName avatar');
  if (!project) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    return;
  }
  project.views = (project.views || 0) + 1;
  await project.save();
  res.json({ success: true, data: project });
}));

// Create project
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const project = await Project.create({ ...req.body, owner: req.user._id });
  await project.populate('owner', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: project });
}));

// Update project
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true }
  );
  res.json({ success: true, data: project });
}));

// Like/unlike project
router.post('/:id/like', authenticate, asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    return;
  }
  const userId = req.user._id;
  const index = project.likes.indexOf(userId);
  if (index > -1) {
    project.likes.splice(index, 1);
  } else {
    project.likes.push(userId);
  }
  await project.save();
  res.json({ success: true, data: { likes: project.likes.length, liked: index === -1 } });
}));

// Semantic search
router.get('/semantic-search/search', authenticate, asyncHandler(async (req, res) => {
  const { q } = req.query;
  // TODO: Implement vector search with MongoDB Atlas
  const projects = await Project.find({ $text: { $search: q as string } })
    .populate('owner', 'firstName lastName avatar')
    .limit(20);
  res.json({ success: true, data: projects });
}));

export default router;
