import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import authRoutes from "./routes/auth.routes";
import videosRoutes from "./routes/videos.routes";
import userRoutes from "./routes/users.routes";
import aiRoutes from "./routes/ai.routes";

import { initSocket } from "./lib/socket";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ── HTTP SERVER ─────────────────────
const server = http.createServer(app);

// ── SOCKET INIT (IMPORTANT FIX) ─────
initSocket(server);

// ── CORS ────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ── MIDDLEWARE ──────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── HEALTH ──────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── ROUTES ──────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/videos", videosRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/ai", aiRoutes);

// ── 404 ─────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ── START SERVER ────────────────────
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Socket enabled`);
  console.log(`🌍 Frontend: ${process.env.FRONTEND_URL}`);
});
export default app;