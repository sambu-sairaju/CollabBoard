import type { Server, Socket } from 'socket.io';

export const initializeSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join a room (for documents, boards, channels)
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      console.log(`📍 User ${socket.id} joined room: ${roomId}`);
    });

    // Leave a room
    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`📍 User ${socket.id} left room: ${roomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Socket.IO initialized');
};
