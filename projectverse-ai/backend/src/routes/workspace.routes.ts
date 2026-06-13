import { Router } from 'express';
import { WorkspaceTask } from '../models/WorkspaceTask.js';
import { WorkspaceNote } from '../models/WorkspaceNote.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router({ mergeParams: true });

// Tasks
router.get('/projects/:projectId/tasks', authenticate, asyncHandler(async (req, res) => {
  const tasks = await WorkspaceTask.find({ projectId: req.params.projectId })
    .populate('assignee', 'firstName lastName avatar')
    .populate('createdBy', 'firstName lastName avatar');
  res.json({ success: true, data: tasks });
}));

router.post('/projects/:projectId/tasks', authenticate, asyncHandler(async (req, res) => {
  const task = await WorkspaceTask.create({
    ...req.body,
    projectId: req.params.projectId,
    createdBy: req.user._id,
  });
  await task.populate('assignee createdBy', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: task });
}));

router.put('/tasks/:id', authenticate, asyncHandler(async (req, res) => {
  const task = await WorkspaceTask.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('assignee createdBy', 'firstName lastName avatar');
  res.json({ success: true, data: task });
}));

router.delete('/tasks/:id', authenticate, asyncHandler(async (req, res) => {
  await WorkspaceTask.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Task deleted' });
}));

// Notes
router.get('/projects/:projectId/notes', authenticate, asyncHandler(async (req, res) => {
  const notes = await WorkspaceNote.find({ projectId: req.params.projectId })
    .populate('createdBy', 'firstName lastName avatar')
    .sort('-updatedAt');
  res.json({ success: true, data: notes });
}));

router.post('/projects/:projectId/notes', authenticate, asyncHandler(async (req, res) => {
  const note = await WorkspaceNote.create({
    ...req.body,
    projectId: req.params.projectId,
    createdBy: req.user._id,
  });
  await note.populate('createdBy', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: note });
}));

router.put('/notes/:id', authenticate, asyncHandler(async (req, res) => {
  const note = await WorkspaceNote.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: note });
}));

export default router;
