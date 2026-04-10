import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  console.log("🔐 Auth middleware hit");

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("❌ No auth header");
      return res.status(401).json({ error: "No token" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Invalid format");
      return res.status(401).json({ error: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    console.log("🔑 Token received");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    console.log("✅ Token valid:", decoded);

    req.userId = decoded.userId;

    next(); // 🚨 VERY IMPORTANT

  } catch (err) {
    console.error("❌ Auth error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}