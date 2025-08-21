// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../utils/constant";
import logger from "../utils/logger";

export interface AuthRequest extends Request {
  user?: any;
}

export const validateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      logger.warn("Access attempt without valid token!");
      return res.status(401).json({
        message: "Token missing",
        success: false,
      });
    }

    try {
      // Dynamic import of 'jose'
      const { jwtVerify } = await import("jose");

      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );

      req.user = verified.payload;
      next();
    } catch (err) {
      logger.warn("Invalid token attempt:", err);
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    logger.error("Token validation error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
