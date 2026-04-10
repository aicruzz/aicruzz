'use client';

import { useEffect, useRef, useState } from 'react';

export default function MotionControl() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [avatarUploaded, setAvatarUploaded] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    startCamera();
    initSocket();
  }, []);

  useEffect(() => {
    if (connected) {
      initFaceTracking();
    }
  }, [connected]);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const initSocket = () => {
    socketRef.current = new WebSocket('ws://localhost:5000');

    socketRef.current.onopen = () => {
      console.log('✅ Connected to Motion Server');
      setConnected(true);
    };

    socketRef.current.onclose = () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    };

    socketRef.current.onerror = (err) => {
      console.error('Socket error:', err);
    };

    socketRef.current.onmessage = (event) => {
      const blob = new Blob([event.data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.src = url;

      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, 640, 480);
        ctx.drawImage(img, 0, 0, 640, 480);
      };
    };
  };

  const initFaceTracking = async () => {
    const { FaceMesh } = await import('@mediapipe/face_mesh');
    const { Camera } = await import('@mediapipe/camera_utils');

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks) return;

      const landmarks = results.multiFaceLandmarks[0];

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify({ landmarks }));
      }
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current! });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: 'avatar',
            image: base64,
          })
        );

        setAvatarUploaded(true);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Motion Control (LIVE AI)</h1>

      <p style={{ color: connected ? 'green' : 'red' }}>
        {connected ? '🟢 Connected' : '🔴 Connecting...'}
      </p>

      {/* UPLOAD */}
      <div style={{ marginBottom: 20 }}>
        <input type="file" accept="image/*" onChange={handleUpload} />

        {avatarUploaded && (
          <p style={{ color: 'green', marginTop: 10 }}>
            ✅ Avatar uploaded — start moving!
          </p>
        )}
      </div>

      {/* CAMERA */}
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* OUTPUT */}
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}