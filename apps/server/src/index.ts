import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import workspaceRoutes from './modules/workspaces/workspaces.routes.js';

// Import socket handler
import { initializeSocket } from './socket/index.js';

// Environment variables
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Create Express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize Socket.IO handlers
initializeSocket(io);

// Middleware
app.use(helmet());
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
  console.log(`
  🚀 CollabBoard Server is running!
  
  ➜ Local:    http://localhost:${PORT}
  ➜ Health:   http://localhost:${PORT}/health
  ➜ API:      http://localhost:${PORT}/api
  
  📦 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

export { app, io };
