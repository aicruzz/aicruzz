'use client';

import { useEffect, useRef, useState } from 'react';

export default function MotionControl() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [framesReceived, setFramesReceived] = useState(0);
  const [socketState, setSocketState] = useState<string>('idle');

  useEffect(() => {
    startCamera();
    connectSocket();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          console.log('✅ Camera ready', videoRef.current?.videoWidth, videoRef.current?.videoHeight);
        };
      }
    } catch (err) {
      setLastError(`Camera error: ${err}`);
    }
  };

  const connectSocket = () => {
    setSocketState('connecting');
    try {
      const ws = new WebSocket('ws://32.192.133.173:4001');
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WS connected');
        setConnected(true);
        setSocketState('open');
      };

      ws.onclose = (e) => {
        console.log('❌ WS closed', e.code, e.reason);
        setConnected(false);
        setSocketState(`closed (${e.code})`);
        setLastError(`WebSocket closed: code ${e.code} — ${e.reason || 'no reason given'}`);
      };

      ws.onerror = (err) => {
        console.error('WS error', err);
        setSocketState('error');
        setLastError('WebSocket connection failed — check server is running and accessible');
      };

      ws.onmessage = (event) => {
        console.log('📨 Message received, size:', event.data.length);
        try {
          const data = JSON.parse(event.data);
          console.log('📦 Parsed keys:', Object.keys(data));

          if (!data.frame) {
            console.warn('⚠️ No "frame" key in response. Got:', Object.keys(data));
            setLastError(`Server responded but no "frame" key. Got: ${Object.keys(data).join(', ')}`);
            return;
          }

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
          img.onerror = () => {
            setLastError('Received frame but image failed to decode — base64 may be malformed');
          };
        } catch (e) {
          setLastError(`Failed to parse server message: ${e}`);
        }
      };
    } catch (err) {
      setLastError(`Failed to create WebSocket: ${err}`);
    }
  };

  const captureFrame = (video: HTMLVideoElement): string => {
    const offscreen = document.createElement('canvas');
    offscreen.width = 256;
    offscreen.height = 256;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(video, 0, 0, 256, 256);
    return offscreen.toDataURL('image/jpeg');
  };

  const sendFrames = () => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!videoRef.current || !avatar) return;
    if (!cameraReady) return;

    const driving = captureFrame(videoRef.current);
    console.log('📤 Sending frame, driving size:', driving.length, 'source size:', avatar.length);

    ws.send(JSON.stringify({ source: avatar, driving }));
    setFrameCount((c) => c + 1);
  };

  useEffect(() => {
    const interval = setInterval(sendFrames, 100);
    return () => clearInterval(interval);
  }, [avatar, cameraReady]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log('🖼 Avatar loaded, size:', result.length);
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: connected ? '#22c55e' : '#ef4444',
        }} />
        <span style={{ fontSize: 13, color: '#888' }}>
          {connected ? 'Connected' : `Disconnected — ${socketState}`}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 500 }}>Motion Control</span>
      </div>

      {/* Error banner */}
      {lastError && (
        <div style={{
          background: '#fff3f3', border: '0.5px solid #f5c6c6', borderRadius: 8,
          padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#c0392b',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
        }}>
          <span>⚠️ {lastError}</span>
          <button onClick={() => setLastError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', marginLeft: 8 }}>✕</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Source face */}
          <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Source face
            </p>
            <div style={{
              aspectRatio: '1', borderRadius: 8,
              background: '#f5f5f5',
              border: avatar ? 'none' : '1.5px dashed #ccc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 10, overflow: 'hidden'
            }}>
              {avatar ? (
                <img src={avatar} alt="Source face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#aaa' }}>
                  <p style={{ fontSize: 12, margin: 0 }}>No image selected</p>
                </div>
              )}
            </div>
            <label style={{
              display: 'block', textAlign: 'center', padding: '7px 0',
              fontSize: 13, border: '0.5px solid #ddd', borderRadius: 8,
              cursor: 'pointer', color: '#333', background: '#fff'
            }}>
              {avatar ? 'Change image' : 'Choose image'}
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Webcam */}
          <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Webcam input {cameraReady ? '✓' : '(waiting...)'}
            </p>
            <div style={{ borderRadius: 8, overflow: 'hidden', background: '#111' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block' }} />
            </div>
          </div>

          {/* Debug panel */}
          <div style={{ background: '#f8f8f8', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Debug</p>
            {[
              ['Socket', socketState],
              ['Camera', cameraReady ? 'ready' : 'not ready'],
              ['Avatar', avatar ? `loaded (${Math.round(avatar.length / 1024)}kb)` : 'none'],
              ['Frames sent', frameCount],
              ['Frames received', framesReceived],
            ].map(([k, v]) => (
              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', borderBottom: '0.5px solid #eee' }}>
                <span style={{ color: '#888' }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{String(v)}</span>
              </div>
            ))}
            <button
              onClick={connectSocket}
              style={{ marginTop: 10, width: '100%', padding: '6px', fontSize: 12, border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', background: '#fff' }}
            >
              Reconnect
            </button>
          </div>
        </div>

        {/* Output canvas */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#888', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI output {framesReceived > 0 ? `· ${framesReceived} frames` : ''}
          </p>
          <div style={{ borderRadius: 8, overflow: 'hidden', background: '#111', position: 'relative' }}>
            <canvas ref={canvasRef} width={640} height={480} style={{ width: '100%', display: 'block' }} />
            {framesReceived === 0 && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
                <p style={{ fontSize: 13, color: '#555', margin: 0 }}>
                  {!connected ? 'Not connected to server' :
                   !avatar ? 'Upload a source image to begin' :
                   'Waiting for frames from server...'}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
            {[
              { label: 'Frames sent', value: frameCount.toLocaleString() },
              { label: 'Frames received', value: framesReceived.toLocaleString() },
              { label: 'Rate', value: avatar && connected ? '10 fps' : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#f8f8f8', borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>{label}</p>
                <p style={{ fontSize: 16, fontWeight: 500, margin: '2px 0 0' }}>{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}