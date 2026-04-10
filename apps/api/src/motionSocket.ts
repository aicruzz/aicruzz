import { WebSocketServer, WebSocket } from 'ws';

const PORT = 5000;

// 🔥 Create WebSocket Server (Frontend connects here)
const wss = new WebSocketServer({ port: PORT });

console.log(`✅ Motion WS Server running on ws://localhost:${PORT}`);

// 🧠 Each user gets their own Python connection
wss.on('connection', (clientWs) => {
  console.log('🟢 Client connected');

  // 🔌 Create dedicated Python connection per user
  const aiWs = new WebSocket('ws://localhost:8000/ws');

  let aiReady = false;

  aiWs.on('open', () => {
    console.log('🤖 Connected to Python AI');
    aiReady = true;
  });

  aiWs.on('message', (frame) => {
    // 📡 Send AI frame back to frontend
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(frame);
    }
  });

  aiWs.on('close', () => {
    console.log('⚠️ Python AI disconnected');
  });

  aiWs.on('error', (err) => {
    console.error('❌ Python WS Error:', err);
  });

  // 📥 Receive motion data from frontend
  clientWs.on('message', (message) => {
    if (aiReady && aiWs.readyState === WebSocket.OPEN) {
      aiWs.send(message);
    }
  });

  // ❌ Handle client disconnect
  clientWs.on('close', () => {
    console.log('🔴 Client disconnected');

    if (aiWs.readyState === WebSocket.OPEN) {
      aiWs.close();
    }
  });

  clientWs.on('error', (err) => {
    console.error('❌ Client WS Error:', err);
  });
});