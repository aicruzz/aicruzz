'use client';

import { useRef } from 'react';
import { useMotionSocket } from '@/hooks/useMotionSocket';

export default function MotionControl() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    connected,
    outputFrame,
    startCamera,
    startSendingFrames,
  } = useMotionSocket('ws://YOUR_GATEWAY_IP:8080');

  const init = async () => {
    if (!videoRef.current) return;

    await startCamera(videoRef.current);
    startSendingFrames();
  };

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      
      {/* INPUT CAMERA */}
      <div>
        <h3>Live Camera</h3>
        <video
          ref={videoRef}
          style={{ width: 400, borderRadius: 10 }}
        />
        <button onClick={init}>
          Start Motion Control
        </button>
      </div>

      {/* OUTPUT AI VIDEO */}
      <div>
        <h3>AI Output</h3>

        {outputFrame ? (
          <img
            src={outputFrame}
            style={{ width: 400, borderRadius: 10 }}
          />
        ) : (
          <div style={{ width: 400, height: 300, background: '#111' }} />
        )}
      </div>

      <p>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
    </div>
  );
}