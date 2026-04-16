'use client';

import { useEffect, useRef, useState } from 'react';

export function useMotionSocket(wsUrl: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [connected, setConnected] = useState(false);
  const [outputFrame, setOutputFrame] = useState<string | null>(null);

  // ----------------------------
  // CONNECT WEBSOCKET
  // ----------------------------
  const connect = () => {
    const ws = new WebSocket(wsUrl);

    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
    };

    ws.onclose = () => {
      console.log('❌ WebSocket disconnected. Reconnecting...');
      setConnected(false);

      setTimeout(() => connect(), 2000); // auto reconnect
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close();
    };

    ws.onmessage = (event) => {
      // AI engine returns processed frame (base64 JPEG)
      const data = event.data;

      try {
        const msg = JSON.parse(data);
        if (msg?.frame) {
          setOutputFrame(msg.frame);
        }
      } catch (e) {
        console.error('Invalid frame received');
      }
    };

    wsRef.current = ws;
  };

  // ----------------------------
  // START CAMERA
  // ----------------------------
  const startCamera = async (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false,
    });

    videoElement.srcObject = stream;
    await videoElement.play();
  };

  // ----------------------------
  // FRAME SENDER LOOP
  // ----------------------------
  const startSendingFrames = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvasRef.current = canvas;

    const sendFrame = () => {
      const ws = wsRef.current;
      const video = videoRef.current;

      if (!ws || ws.readyState !== 1 || !video || !ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // compress frame (VERY IMPORTANT for lag control)
      const frame = canvas.toDataURL('image/jpeg', 0.6);

      ws.send(
        JSON.stringify({
          type: 'frame',
          image: frame,
          timestamp: Date.now(),
        })
      );
    };

    // ~10 FPS (adjust later for performance tuning)
    setInterval(sendFrame, 100);
  };

  useEffect(() => {
    connect();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return {
    connected,
    outputFrame,
    startCamera,
    startSendingFrames,
  };
}