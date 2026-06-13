import { Router } from 'express';
import { AIConversation } from '../models/AIConversation.js';
import { GeminiService } from '../services/gemini.service.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();
const gemini = GeminiService.getInstance();

// AI Mentor Routes
router.get('/mentor/conversations', authenticate, asyncHandler(async (req, res) => {
  const conversations = await AIConversation.find({ userId: req.user._id, aiType: 'mentor' }).sort('-updatedAt');
  res.json({ success: true, data: conversations });
}));

router.post('/mentor/conversations', authenticate, asyncHandler(async (req, res) => {
  const conv = await AIConversation.create({ userId: req.user._id, aiType: 'mentor', title: 'New Chat' });
  res.status(201).json({ success: true, data: conv });
}));

router.post('/mentor/conversations/:id/message', authenticate, asyncHandler(async (req, res) => {
  const { message } = req.body;
  const conv = await AIConversation.findById(req.params.id);
  if (!conv) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }

  conv.messages.push({ role: 'user', content: message, timestamp: new Date() });

  const context = conv.context ? `Topic: ${conv.context.topic || ''}\nCareer Goal: ${conv.context.careerGoal || ''}` : '';
  const response = await gemini.generateResponse('mentor', message, context);

  conv.messages.push({ role: 'assistant', content: response, timestamp: new Date() });
  if (conv.messages.length === 2) {
    conv.title = message.slice(0, 50);
  }
  await conv.save();

  res.json({ success: true, data: { response, conversation: conv } });
}));

router.post('/mentor/roadmap', authenticate, asyncHandler(async (req, res) => {
  const { careerGoal, skills, level } = req.body;
  const roadmap = await gemini.generateRoadmap(careerGoal, skills || [], level || 'beginner');
  res.json({ success: true, data: { roadmap } });
}));

router.post('/mentor/interview-prep', authenticate, asyncHandler(async (req, res) => {
  const { topic, difficulty } = req.body;
  const prep = await gemini.generateInterviewPrep(topic, difficulty || 'medium');
  res.json({ success: true, data: { prep } });
}));

// AI Co-Founder Routes
router.get('/cofounder/conversations', authenticate, asyncHandler(async (req, res) => {
  const conversations = await AIConversation.find({ userId: req.user._id, aiType: 'cofounder' }).sort('-updatedAt');
  res.json({ success: true, data: conversations });
}));

router.post('/cofounder/conversations/:id/message', authenticate, asyncHandler(async (req, res) => {
  const { message } = req.body;
  const conv = await AIConversation.findById(req.params.id);
  if (!conv) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }

  conv.messages.push({ role: 'user', content: message, timestamp: new Date() });
  const context = conv.context ? `Project: ${conv.context.projectIdea || ''}` : '';
  const response = await gemini.generateResponse('cofounder', message, context);
  conv.messages.push({ role: 'assistant', content: response, timestamp: new Date() });
  await conv.save();

  res.json({ success: true, data: { response, conversation: conv } });
}));

router.post('/cofounder/architecture', authenticate, asyncHandler(async (req, res) => {
  const { projectIdea, requirements } = req.body;
  const architecture = await gemini.generateArchitecture(projectIdea, requirements || []);
  res.json({ success: true, data: { architecture } });
}));

router.post('/cofounder/database-design', authenticate, asyncHandler(async (req, res) => {
  const { projectIdea, features } = req.body;
  const schema = await gemini.generateDatabaseSchema(projectIdea, features || []);
  res.json({ success: true, data: { schema } });
}));

router.post('/cofounder/sprint-plan', authenticate, asyncHandler(async (req, res) => {
  const { features, teamSize, duration } = req.body;
  const plan = await gemini.generateSprintPlan(features || [], teamSize || 3, duration || 12);
  res.json({ success: true, data: { plan } });
}));

// AI Chatbot Routes
router.get('/chatbot/conversations', authenticate, asyncHandler(async (req, res) => {
  const conversations = await AIConversation.find({ userId: req.user._id, aiType: 'chatbot' }).sort('-updatedAt');
  res.json({ success: true, data: conversations });
}));

router.post('/chatbot/conversations', authenticate, asyncHandler(async (req, res) => {
  const conv = await AIConversation.create({ userId: req.user._id, aiType: 'chatbot', title: 'New Chat' });
  res.status(201).json({ success: true, data: conv });
}));

router.post('/chatbot/conversations/:id/message', authenticate, asyncHandler(async (req, res) => {
  const { message } = req.body;
  const conv = await AIConversation.findById(req.params.id);
  if (!conv) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }

  conv.messages.push({ role: 'user', content: message, timestamp: new Date() });
  const response = await gemini.generateResponse('chatbot', message);
  conv.messages.push({ role: 'assistant', content: response, timestamp: new Date() });
  await conv.save();

  res.json({ success: true, data: { response, conversation: conv } });
}));

router.post('/chatbot/explain', authenticate, asyncHandler(async (req, res) => {
  const { concept, level } = req.body;
  const explanation = await gemini.explainConcept(concept, level || 'beginner');
  res.json({ success: true, data: { explanation } });
}));

router.post('/chatbot/code-help', authenticate, asyncHandler(async (req, res) => {
  const { code, language, problem } = req.body;
  const help = await gemini.codeHelp(code, language, problem);
  res.json({ success: true, data: { help } });
}));

export default router;
