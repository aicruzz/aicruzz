import axios from "axios";
import { VideoProvider } from "./types";

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY!;

export const runwayProvider: VideoProvider = {
  name: "runway",

  async generate(prompt: string) {
    try {
      console.log("🎥 Runway generating...");

      const res = await axios.post(
        "https://api.runwayml.com/v1/generate",
        { prompt, model: "gen-2" },
        {
          headers: {
            Authorization: `Bearer ${RUNWAY_API_KEY}`,
          },
        }
      );

      const jobId = res.data.id;

      let status = "processing";
      let videoUrl: string | null = null;

      while (status !== "succeeded") {
        await new Promise((r) => setTimeout(r, 5000));

        const statusRes = await axios.get(
          `https://api.runwayml.com/v1/tasks/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${RUNWAY_API_KEY}`,
            },
          }
        );

        status = statusRes.data.status;

        if (status === "failed") {
          throw new Error("Runway failed");
        }

        if (status === "succeeded") {
          videoUrl = statusRes.data.output[0];
        }
      }

      return { url: videoUrl };
    } catch (err) {
      console.error("Runway error:", err);
      return { url: null };
    }
  },
};