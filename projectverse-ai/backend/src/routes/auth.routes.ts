import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { logger } from '../config/logger.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId, role, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
};

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, college } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ success: false, error: { code: 'EMAIL_EXISTS', message: 'Email already registered' } });
    return;
  }

  const user = await User.create({
    email, password, firstName, lastName,
    role: role || 'student', college,
    status: 'active', isEmailVerified: true,
  });

  const tokens = generateTokens(user._id.toString(), user.role);
  res.status(201).json({
    success: true,
    data: {
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      tokens,
    },
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    return;
  }

  user.lastActive = new Date();
  await user.save();

  const tokens = generateTokens(user._id.toString(), user.role);
  res.json({
    success: true,
    data: {
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar },
      tokens,
    },
  });
}));

// Google OAuth
router.post('/google', asyncHandler(async (req, res) => {
  const { googleId, email, firstName, lastName, avatar } = req.body;

  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.create({
      googleId, email, firstName, lastName, avatar,
      password: Math.random().toString(36).slice(-16),
      role: 'student', status: 'active', isEmailVerified: true,
    });
  }

  const tokens = generateTokens(user._id.toString(), user.role);
  res.json({
    success: true,
    data: {
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar },
      tokens,
    },
  });
}));

// Refresh Token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
  if (decoded.type !== 'refresh') {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' } });
    return;
  }

  const tokens = generateTokens(decoded.userId, decoded.role);
  res.json({ success: true, data: { tokens } });
}));

// Get Me
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
}));

// Logout
router.post('/logout', authenticate, asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' }));
}));

export default router;
