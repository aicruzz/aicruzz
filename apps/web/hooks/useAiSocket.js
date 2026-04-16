import { useEffect, useRef, useState } from "react";

export default function useAiSocket() {
  const socketRef = useRef(null);
  const [frame, setFrame] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:4001");

    socketRef.current.onopen = () => {
      console.log("✅ Connected to Gateway");
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.frame) {
          setFrame(`data:image/jpeg;base64,${data.frame}`);
        }
      } catch (e) {
        console.log("Invalid message", event.data);
      }
    };

    socketRef.current.onerror = (err) => {
      console.log("Socket error:", err);
    };

    socketRef.current.onclose = () => {
      setConnected(false);
    };

    return () => socketRef.current?.close();
  }, []);

  const sendFrame = (source, driving) => {
    if (socketRef.current?.readyState === 1) {
      socketRef.current.send(JSON.stringify({ source, driving }));
    }
  };

  return { frame, sendFrame, connected };
}