import { io } from "socket.io-client";
import { getToken } from "./auth";

const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const socket = io(URL, {
  autoConnect: false,
});

// ✅ CONNECT WITH JWT + JOIN ROOM (CRITICAL FIX)
export function connectSocket() {
  const token = getToken();

  if (!token) {
    console.warn("⚠️ No token, socket not connected");
    return;
  }

  // 🔥 attach token (optional for backend auth later)
  socket.auth = { token };

  socket.connect();

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);

    try {
      // ✅ EXTRACT userId FROM TOKEN
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;

      if (userId) {
        // 🔥 JOIN ROOM (THIS IS THE MISSING PIECE)
        socket.emit("join", userId);
        console.log("👤 Joined room:", userId);
      }
    } catch (err) {
      console.error("❌ Failed to parse token:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket error:", err.message);
  });
}