import { VideoProvider } from "./types";

export const pikaProvider: VideoProvider = {
  name: "pika",

  async generate(prompt: string) {
    try {
      console.log("🎬 Pika generating...");

      // Replace later with real API
      return {
        url: null,
      };
    } catch (err) {
      return { url: null };
    }
  },
};