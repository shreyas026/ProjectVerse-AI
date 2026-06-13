import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './app.js';
import { connectDB } from './config/database.js';
import { initializeSocket } from './config/socket.js';
import { logger } from './config/logger.js';

const PORT = process.env.PORT || 5000;
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`ProjectVerse API Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to database:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err.message);
  process.exit(1);
});
