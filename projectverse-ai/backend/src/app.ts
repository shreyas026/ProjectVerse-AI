import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/error.js';
import { requestValidator } from './middleware/validate.js';
import { logger } from './config/logger.js';
import { allowedOrigins } from './config/cors.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import teamRoutes from './routes/team.routes.js';
import eventRoutes from './routes/event.routes.js';
import messageRoutes from './routes/message.routes.js';
import codingRoutes from './routes/coding.routes.js';
import aiRoutes from './routes/ai.routes.js';
import companyRoutes from './routes/company.routes.js';
import jobRoutes from './routes/job.routes.js';
import researchRoutes from './routes/research.routes.js';
import startupRoutes from './routes/startup.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import mlRoutes from './routes/ml.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Compression
app.use(compression());

// Validation middleware
app.use(requestValidator);

// Root route - API info
app.get('/', (_req, res) => {
  res.json({
    name: 'ProjectVerse AI API',
    version: '1.0.0',
    description: 'AI-Powered Innovation, Collaboration, Learning & Talent Discovery Ecosystem',
    documentation: '/health',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      projects: '/api/v1/projects',
      ai: '/api/v1/ai',
      ml: '/api/v1/ml',
      coding: '/api/v1/coding',
      events: '/api/v1/events',
    },
    ai: {
      ollama: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      models: {
        chat: process.env.OLLAMA_CHAT_MODEL || 'llama3.1:8b',
        code: process.env.OLLAMA_CODE_MODEL || 'codellama:7b',
        embeddings: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',
      },
      huggingface: {
        'all-MiniLM-L6-v2': 'Local (Xenova) - Originality Check, Team Recommendation',
        'bge-small-en-v1.5': 'Local (Xenova) - Semantic Search',
      },
      mlService: process.env.ML_SERVICE_URL || 'http://localhost:7001',
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/coding', codingRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/research', researchRoutes);
app.use('/api/v1/startups', startupRoutes);
app.use('/api/v1/workspace', workspaceRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/ml', mlRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Global error handler
app.use(errorHandler);

export default app;
