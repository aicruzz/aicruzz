'use client';

import { useEffect, useRef, useState } from 'react';

export default function MotionControl() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [connected, setConnected] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [framesReceived, setFramesReceived] = useState(0);

  const [lastError, setLastError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [socketState, setSocketState] = useState<string>('idle');

  // ----------------------------
  // INIT
  // ----------------------------
  useEffect(() => {
    startCamera();
    connectSocket();

    return () => cleanup();
  }, []);

  const cleanup = () => {
    socketRef.current?.close();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // ----------------------------
  // CAMERA
  // ----------------------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          console.log('✅ Camera ready');
        };
      }
    } catch (err) {
      setLastError(`Camera error: ${err}`);
    }
  };

  // ----------------------------
  // WEBSOCKET
  // ----------------------------
  const connectSocket = () => {
    setSocketState('connecting');

    const ws = new WebSocket('ws://32.192.133.173:4001');
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setSocketState('open');
      console.log('✅ WS connected');
    };

    ws.onclose = (e) => {
      setConnected(false);
      setSocketState(`closed (${e.code})`);
      setLastError(`WebSocket closed: ${e.code}`);
      console.log('❌ WS closed');

      stopStream();
      setTimeout(connectSocket, 2000);
    };

    ws.onerror = () => {
      setSocketState('error');
      setLastError('WebSocket connection error');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type !== 'result') return;
        if (!data.frame) return;

        const img = new Image();
        img.src = `data:image/jpeg;base64,${data.frame}`;

        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (!ctx || !canvas) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          setFramesReceived((c) => c + 1);
        };
      } catch (err) {
        setLastError(`Parse error: ${err}`);
      }
    };
  };

  // ----------------------------
  // FRAME CAPTURE
  // ----------------------------
  const captureFrame = (video: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 256;
    canvas.height = 256;

    ctx.drawImage(video, 0, 0, 256, 256);

    return canvas.toDataURL('image/jpeg', 0.6);
  };

  // ----------------------------
  // STREAM CONTROL
  // ----------------------------
  const sendFrame = () => {
    const ws = socketRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!videoRef.current || !avatar) return;
    if (!cameraReady) return;

    const frame = captureFrame(videoRef.current);

    ws.send(
      JSON.stringify({
        source: avatar,
        driving: frame, // ✅ FIXED (matches gateway)
      })
    );

    setFrameCount((c) => c + 1);
  };

  const startStream = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      sendFrame();
    }, 150); // ✅ safer FPS (prevents overload)
  };

  const stopStream = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  // start stream only when stable
  useEffect(() => {
    if (cameraReady && avatar && connected) {
      startStream();
    }
  }, [cameraReady, avatar, connected]);

  // ----------------------------
  // UPLOAD IMAGE
  // ----------------------------
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
      console.log('🖼 Avatar loaded');

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            source: result,
          })
        );
      }
    };

    reader.readAsDataURL(file);
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 900, margin: '0 auto', padding: 24 }}>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: connected ? '#22c55e' : '#ef4444',
        }} />

        <span style={{ fontSize: 13, color: '#666' }}>
          {connected ? 'Connected' : socketState}
        </span>

        <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
          Motion Control
        </span>
      </div>

      {lastError && (
        <div style={{ background: '#ffecec', padding: 10, marginBottom: 10 }}>
          ⚠️ {lastError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>

        <div>
          <p>Source Image</p>

          <div style={{
            width: '100%',
            aspectRatio: '1',
            background: '#eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {avatar ? <img src={avatar} style={{ width: '100%' }} /> : <span>No image</span>}
          </div>

          <input type="file" onChange={handleUpload} />

          <p style={{ marginTop: 10 }}>
            Camera {cameraReady ? '✓' : '...'}
          </p>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', background: '#111' }}
          />
        </div>

        <div>
          <p>AI Output</p>

          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{ width: '100%', background: '#111' }}
          />

          <div style={{ marginTop: 10, fontSize: 12 }}>
            Frames sent: {frameCount} | Frames received: {framesReceived}
          </div>
        </div>
      </div>
    </div>
  );
}