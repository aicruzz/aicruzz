import axios from "axios";

const AI_BASE_URL = process.env.AI_BASE_URL;

if (!AI_BASE_URL) {
  throw new Error("AI_BASE_URL not set in env");
}

export const generateVideo = async (payload: any) => {
  try {
    const response = await axios.post(
      `${AI_BASE_URL}/generate`,
      payload,
      {
        timeout: 1000 * 60 * 15, // 15 min GPU jobs
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ FastAPI Error:", error.message);
    throw new Error("AI generation failed");
  }
};