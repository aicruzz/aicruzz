import { Worker } from "bullmq";
import IORedis from "ioredis";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("🚀 Worker starting...");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connection = {
  url: process.env.REDIS_URL!,
};

const worker = new Worker(
  "video-generation",
  async (job) => {
    const { videoId, prompt } = job.data;

    console.log("🎬 Processing video:", videoId);

    await new Promise((r) => setTimeout(r, 5000));

    const fakeUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

    await pool.query(
      `UPDATE videos 
       SET status = 'completed', url = $1
       WHERE id = $2`,
      [fakeUrl, videoId]
    );

    console.log("✅ Video completed:", videoId);
  },
  {
    connection: {
      url: process.env.REDIS_URL!,
    },
  }
);

// 👇 ADD THESE
worker.on("ready", () => {
  console.log("🟢 Worker ready and waiting for jobs...");
});

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`💥 Job ${job?.id} failed:`, err);
});