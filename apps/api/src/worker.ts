import { Worker } from "bullmq";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
// @ts-ignore
import ffprobePath from "ffprobe-static";

import fs from "fs";
import axios from "axios";
import { uploadToS3 } from "./lib/s3";

ffmpeg.setFfmpegPath(ffmpegPath as string);
ffmpeg.setFfprobePath(ffprobePath.path);

// =========================
// 🗄 DATABASE
// =========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// =========================
// 🤖 AI ENGINE (FASTAPI)
// =========================
const AI_BASE_URL = process.env.AI_BASE_URL;

if (!AI_BASE_URL) {
  throw new Error("❌ AI_BASE_URL is not set in .env");
}

// =========================
// 🔁 REDIS
// =========================
const connection = {
  url: process.env.REDIS_URL!,
};

// =========================
// 🎬 WORKER
// =========================
const worker = new Worker(
  "video-generation",
  async (job) => {
    const { videoId, prompt } = job.data;

    console.log("🎬 Processing video:", videoId);

    const videoPath = `/tmp/input-${videoId}.mp4`;
    const thumbnailPath = `/tmp/thumb-${videoId}.jpg`;

    try {
      // =========================
      // 🚀 START
      // =========================
      await pool.query(
        `UPDATE videos SET status='processing', progress=10 WHERE id=$1`,
        [videoId]
      );

      console.log("🚀 Started processing");

      // =========================
      // ⚡ CALL FASTAPI GPU
      // =========================
      await pool.query(
        `UPDATE videos SET progress=25 WHERE id=$1`,
        [videoId]
      );

      let videoUrl: string | null = null;

      try {
        console.log("⚡ Calling FastAPI GPU...");

        const response = await axios.post(
          `${AI_BASE_URL}/generate`,
          {
            prompt,
            videoId,
          },
          {
            timeout: 1000 * 60 * 20, // 20 mins
          }
        );

        const data = response.data;

        if (!data.success || !data.videoUrl) {
          throw new Error("Invalid FastAPI response");
        }

        videoUrl = data.videoUrl;

        console.log("✅ FastAPI video URL:", videoUrl);
      } catch (err) {
        console.error("❌ FastAPI failed:", err);
      }

      // =========================
      // 🟡 HARD FALLBACK (ONLY IF NEEDED)
      // =========================
      if (!videoUrl) {
        console.log("⚠️ Using fallback video...");
        videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      }

      // =========================
      // 📥 DOWNLOAD VIDEO
      // =========================
      await pool.query(
        `UPDATE videos SET progress=40 WHERE id=$1`,
        [videoId]
      );

      const res = await fetch(videoUrl);
      if (!res.ok) throw new Error("Download failed");

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(videoPath, buffer);

      console.log("📥 Video downloaded");

      // =========================
      // 🖼 THUMBNAIL
      // =========================
      await pool.query(
        `UPDATE videos SET progress=65 WHERE id=$1`,
        [videoId]
      );

      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .on("end", resolve)
          .on("error", reject)
          .screenshots({
            count: 1,
            folder: "/tmp",
            filename: `thumb-${videoId}.jpg`,
            size: "320x?",
          });
      });

      console.log("🖼 Thumbnail created");

      // =========================
      // ☁️ UPLOAD S3
      // =========================
      await pool.query(
        `UPDATE videos SET progress=85 WHERE id=$1`,
        [videoId]
      );

      const videoKey = `videos/video-${videoId}.mp4`;
      const thumbKey = `thumbnails/thumb-${videoId}.jpg`;

      const videoS3Url = await uploadToS3(videoPath, videoKey);
      const thumbnailS3Url = await uploadToS3(thumbnailPath, thumbKey);

      if (!videoS3Url || !thumbnailS3Url) {
        throw new Error("Upload failed");
      }

      console.log("☁️ Uploaded to S3");

      // =========================
      // ✅ DONE
      // =========================
      await pool.query(
        `UPDATE videos 
         SET status='done',
             progress=100,
             url=$1,
             "thumbnailUrl"=$2
         WHERE id=$3`,
        [videoS3Url, thumbnailS3Url, videoId]
      );

      console.log("✅ DONE:", videoId);

      // =========================
      // 🧹 CLEANUP
      // =========================
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);

    } catch (err) {
      console.error("❌ Worker error:", err);

      await pool.query(
        `UPDATE videos 
         SET status='failed',
             progress=0
         WHERE id=$1`,
        [videoId]
      );

      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
    }
  },
  { connection }
);

// =========================
// 🔔 EVENTS
// =========================
worker.on("ready", () => {
  console.log("🟢 Worker ready...");
});

worker.on("failed", (job, err) => {
  console.error("💥 Job failed:", job?.id, err);
});