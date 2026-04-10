import { Router, Request, Response } from "express";

const router = Router();

// 🔥 CHAT TO CREATE
router.post("/chat-to-create", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    // ✅ Call OpenAI
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `
You are an AI video creator.

User prompt: "${prompt}"

Return JSON:
{
  "script": "...",
  "scenes": ["scene 1", "scene 2"],
  "imagePrompts": ["prompt1", "prompt2"],
  "style": "cinematic / animation / avatar"
}
        `,
      }),
    });

    const data = await response.json();

    res.json({
      success: true,
      data: data.output?.[0]?.content?.[0]?.text || null,
    });

  } catch (err) {
    console.error("Chat to Create error:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

export default router;