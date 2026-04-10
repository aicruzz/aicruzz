import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import './motionSocket';

import authRoutes from './routes/auth.routes';
import videosRoutes from './routes/videos.routes';
import userRoutes from './routes/users.routes';
import aiRoutes from "./routes/ai.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ── CREATE HTTP SERVER ───────────────────────────────────────
const server = http.createServer(app);

// ── SOCKET.IO SETUP ──────────────────────────────────────────
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// ── SOCKET CONNECTION (FIXED & STABLE) ───────────────────────
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // ✅ JOIN ROOM (more reliable than handshake.query)
  socket.on('join', (userId: string) => {
    if (!userId) return;

    socket.join(String(userId));
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// ── CORS CONFIG ──────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/videos', videosRoutes);
app.use('/api/v1/users', userRoutes);
app.use("/api/v1/ai", aiRoutes);

// ── 404 fallback ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route does not exist' });
});

// ── START SERVER ─────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 AiCruzz API running at http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `   DB:  ${process.env.DATABASE_URL ? 'configured' : '⚠ DATABASE_URL not set'}`
  );
  console.log(
    `   FRONTEND: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`
  );
});

export default app;