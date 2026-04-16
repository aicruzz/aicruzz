import { useEffect, useRef } from "react";
import useAiSocket from "../hooks/useAiSocket";

export default function LiveAiView() {
  const { frame, sendFrame } = useAiSocket();
  const videoRef = useRef(null);

  // Start camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  // Capture frame
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 512, 512);

    const base64 = canvas.toDataURL("image/jpeg");

    // send to AI
    sendFrame(base64, base64);
  };

  // 🔥 AUTO STREAM (REAL-TIME)
  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame();
    }, 200); // ~5 FPS

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center">

      {/* INPUT (WEBCAM) */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Input (Camera)</h2>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-96 rounded-xl border"
        />
      </div>

      {/* OUTPUT (AI RESULT) */}
      <div>
        <h2 className="text-lg font-semibold mb-2">AI Output</h2>
        <div className="w-96 h-96 border rounded-xl flex items-center justify-center bg-black">
          {frame ? (
            <img
              src={frame}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-white">No AI output yet</span>
          )}
        </div>
      </div>

      {/* OPTIONAL MANUAL BUTTON */}
      <button
        onClick={captureFrame}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send Frame (Manual)
      </button>
    </div>
  );
}