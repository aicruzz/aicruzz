import { Request, Response } from "express";
import pool from "../db/pool";
import { AuthRequest } from "../middleware/auth.middleware";
import { videoQueue } from "../queue";

// GET /api/v1/videos
export async function listVideos(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId || "test-user-id";

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT id, user_id, prompt, style, duration, resolution,
              status, url, created_at
       FROM videos
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM videos WHERE user_id = $1",
      [userId]
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    console.error("listVideos error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// GET /api/v1/videos/:id
export async function getVideo(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid video id" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, status, url FROM videos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getVideo error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// POST /api/v1/videos/generate
export async function generateVideo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { prompt, style, duration, resolution } = req.body;

    const userId = req.userId || "00000000-0000-0000-0000-000000000001";

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO videos (prompt, status, user_id, style, duration, resolution)
       VALUES ($1, 'queued', $2, $3, $4, $5)
       RETURNING id`,
      [prompt, userId, style || null, duration || null, resolution || null]
    );

    const videoId = result.rows[0].id;

    await videoQueue.add("generate-video", {
      videoId,
      prompt,
    });

    res.json({
      id: videoId,
      status: "queued",
      url: null,
    });

  } catch (error) {
    console.error("generateVideo error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// DELETE /api/v1/videos/:id
export async function deleteVideo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId || "test-user-id";

    const result = await pool.query(
      "DELETE FROM videos WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, userId]
    );

    if (!result.rowCount) {
      res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
      return;
    }

    res.json({ message: "Video deleted" });
  } catch (err) {
    console.error("deleteVideo error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// GET /api/v1/videos/:id/status
export async function getVideoStatus(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid video ID" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, status, url FROM videos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        error: "Not Found",
        message: "Video not found",
      });
      return;
    }

    res.json(result.rows[0]);
    return;

  } catch (err) {
    console.error("getVideoStatus error:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
}