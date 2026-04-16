'use client';

import { useEffect, useRef, useState } from 'react';

export default function MotionControl() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    connectSocket();
  }, []);

  // 🎥 Start webcam
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // 🔌 CONNECT TO GATEWAY (IMPORTANT)
  const connectSocket = () => {
    socketRef.current = new WebSocket('ws://aicruzz.com:4001');

    socketRef.current.onopen = () => {
      console.log('✅ Connected to Gateway');
      setConnected(true);
    };

    socketRef.current.onclose = () => {
      console.log('❌ Disconnected');
      setConnected(false);
    };

    socketRef.current.onerror = (err) => {
      console.error('Socket error:', err);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.frame) return;

        const img = new Image();
        img.src = `data:image/jpeg;base64,${data.frame}`;

        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (!ctx) return;

          ctx.clearRect(0, 0, 640, 480);
          ctx.drawImage(img, 0, 0, 640, 480);
        };
      } catch (e) {
        console.log('Bad frame');
      }
    };
  };

  // 📸 Capture image from video
  const captureFrame = (video: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.drawImage(video, 0, 0, 256, 256);

    return canvas.toDataURL('image/jpeg');
  };

  // 🚀 SEND FRAMES TO AI ENGINE (CORE FIX)
  const sendFrames = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    if (!videoRef.current) return;

    const driving = captureFrame(videoRef.current);

    socketRef.current.send(
      JSON.stringify({
        source: avatar,     // uploaded image
        driving: driving,   // live webcam frame
      })
    );
  };

  // ⏱️ LOOP SENDING FRAMES
  useEffect(() => {
    const interval = setInterval(() => {
      sendFrames();
    }, 100); // 10 fps (stable)

    return () => clearInterval(interval);
  }, [avatar]);

  // 🖼 Upload avatar (SOURCE FACE)
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Motion Control (LIVE AI)</h2>

      <p style={{ color: connected ? 'green' : 'red' }}>
        {connected ? '🟢 Connected' : '🔴 Connecting...'}
      </p>

      {/* Upload source image */}
      <input type="file" accept="image/*" onChange={handleUpload} />

      {/* hidden video */}
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* output */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ border: '1px solid black', marginTop: 20 }}
      />
    </div>
  );
}