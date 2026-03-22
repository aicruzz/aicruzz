import { Queue } from "bullmq";

export const videoQueue = new Queue("video-generation", {
  connection: {
    url: process.env.REDIS_URL!,
  },
});