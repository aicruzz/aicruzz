import { Server } from "socket.io";
import http from "http";

let io: Server | null = null;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("join", (userId: string) => {
      if (!userId) return;
      socket.join(userId);
      console.log(`👤 Joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  console.log("✅ Socket initialized");
  return io;
}

export function getIO() {
  if (!io) {
    console.log("⚠ Socket not ready yet — skipping emit");
    // return dummy safe object to prevent crash
    return {
      to: () => ({
        emit: () => {},
      }),
      emit: () => {},
    } as any;
  }

  return io;
}