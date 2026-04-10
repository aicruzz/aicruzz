import { Request, Response } from "express";
import pool from "../db/pool";
import { AuthRequest } from "../middleware/auth.middleware";
import { videoQueue } from "../queue";
import { getSignedVideoUrl } from "../lib/s3Signed";
import { io } from "../index";

// ✅ Helper
function extractS3Key(url: string): string | null {
  try {
    if (!url.includes(".amazonaws.com/")) return null;
    return url.split(".amazonaws.com/")[1] || null;
  } catch {
    return null;
  }
}

// ✅ Helper: sign both video + thumbnail
async function signVideo(video: any) {
  let updated = { ...video };

  // 🎬 VIDEO URL
  if (video.url) {
    const key = extractS3Key(video.url);
    if (key) {
      try {
        updated.url = await getSignedVideoUrl(key);
      } catch (err) {
        console.error("Video signing error:", err);
      }
    }
  }

  // 🖼 THUMBNAIL URL
  if (video.thumbnailUrl) {
    const key = extractS3Key(video.thumbnailUrl);
    if (key) {
      try {
        updated.thumbnailUrl = await getSignedVideoUrl(key);
      } catch (err) {
        console.error("Thumbnail signing error:", err);
      }
    }
  }

  return updated;
}

// GET VIDEOS
export async function listVideos(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await pool.query(
      `SELECT id, user_id, prompt, style, duration, resolution,
              status, url, "thumbnailUrl", created_at
       FROM videos
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    );

    const videos = await Promise.all(
      result.rows.map((video) => signVideo(video))
    );

    res.json({ data: videos });
  } catch (err) {
    console.error("listVideos error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// GET SINGLE VIDEO
export async function getVideo(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid video id" });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT * FROM videos WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    const video = await signVideo(result.rows[0]);

    res.json(video);
  } catch (err) {
    console.error("getVideo error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// CREATE VIDEO
export async function generateVideo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { prompt, style, duration, resolution } = req.body;

    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO videos (prompt, status, user_id, style, duration, resolution)
       VALUES ($1, 'queued', $2, $3, $4, $5)
       RETURNING *`,
      [prompt, req.userId, style || null, duration || null, resolution || null]
    );

    const video = result.rows[0];

    // ✅ Emit instantly (UI shows immediately)
    io.to(String(req.userId)).emit("video:update", video);

    // 🔥🔥🔥 CRITICAL FIX (MATCH WORKER)
    await videoQueue.add("video-generation", {
      videoId: video.id,
      prompt,
      userId: req.userId,
    });

    res.json(video);
  } catch (error) {
    console.error("generateVideo error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// DELETE VIDEO
export async function deleteVideo(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await pool.query(
      "DELETE FROM videos WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.userId]
    );

    if (!result.rowCount) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    res.json({ message: "Video deleted" });
  } catch (err) {
    console.error("deleteVideo error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// STATUS
export async function getVideoStatus(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid video ID" });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT * FROM videos WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    const video = await signVideo(result.rows[0]);

    res.json(video);
  } catch (err) {
    console.error("getVideoStatus error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}