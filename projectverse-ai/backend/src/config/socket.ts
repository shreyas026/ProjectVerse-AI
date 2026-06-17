import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { logger } from './logger.js';
import { allowedOrigins } from './cors.js';

let io: SocketIOServer;

export const initializeSocket = (server: HttpServer): void => {
  io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join conversation room
    socket.on('join_conversation', (data: { conversationId: string }) => {
      socket.join(data.conversationId);
      logger.info(`Socket ${socket.id} joined conversation ${data.conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (data: { conversationId: string }) => {
      socket.leave(data.conversationId);
    });

    // Handle messages
    socket.on('send_message', (data: { conversationId: string; content: string; senderId: string }) => {
      socket.to(data.conversationId).emit('new_message', {
        conversationId: data.conversationId,
        content: data.content,
        senderId: data.senderId,
        timestamp: new Date().toISOString(),
      });
    });

    // Typing indicators
    socket.on('typing', (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      socket.to(data.conversationId).emit('user_typing', {
        userId: data.userId,
        isTyping: data.isTyping,
      });
    });

    // WebRTC Signaling for calls
    socket.on('call_initiate', (data: { recipientId: string; callerId: string; type: 'audio' | 'video' }) => {
      socket.to(data.recipientId).emit('incoming_call', {
        callerId: data.callerId,
        type: data.type,
      });
    });

    socket.on('call_offer', (data: { targetId: string; sdp: RTCSessionDescriptionInit }) => {
      socket.to(data.targetId).emit('call_offer', { sdp: data.sdp });
    });

    socket.on('call_answer', (data: { targetId: string; sdp: RTCSessionDescriptionInit }) => {
      socket.to(data.targetId).emit('call_answer', { sdp: data.sdp });
    });

    socket.on('call_ice_candidate', (data: { targetId: string; candidate: RTCIceCandidateInit }) => {
      socket.to(data.targetId).emit('call_ice_candidate', { candidate: data.candidate });
    });

    socket.on('call_end', (data: { targetId: string }) => {
      socket.to(data.targetId).emit('call_ended');
    });

    // Notifications
    socket.on('join_user_room', (data: { userId: string }) => {
      socket.join(`user_${data.userId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO initialized');
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};
