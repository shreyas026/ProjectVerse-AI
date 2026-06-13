import { Router } from 'express';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

// Get conversations
router.get('/conversations', authenticate, asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'firstName lastName avatar')
    .sort('-updatedAt');
  res.json({ success: true, data: conversations });
}));

// Create conversation
router.post('/conversations', authenticate, asyncHandler(async (req, res) => {
  const { participants, type, name } = req.body;
  const allParticipants = [...new Set([...participants, req.user._id.toString()])];

  const conversation = await Conversation.create({
    type: type || 'direct',
    participants: allParticipants,
    name,
  });
  await conversation.populate('participants', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: conversation });
}));

// Get messages
router.get('/conversations/:id/messages', authenticate, asyncHandler(async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.id })
    .populate('sender', 'firstName lastName avatar')
    .sort('createdAt');
  res.json({ success: true, data: messages });
}));

// Send message
router.post('/conversations/:id/messages', authenticate, asyncHandler(async (req, res) => {
  const { content, type = 'text' } = req.body;
  const message = await Message.create({
    conversationId: req.params.id,
    sender: req.user._id,
    content: { type, text: content },
  });

  // Update conversation last message
  await Conversation.findByIdAndUpdate(req.params.id, {
    lastMessage: { content, sender: req.user._id, timestamp: new Date() },
    updatedAt: new Date(),
  });

  await message.populate('sender', 'firstName lastName avatar');
  res.status(201).json({ success: true, data: message });
}));

export default router;
