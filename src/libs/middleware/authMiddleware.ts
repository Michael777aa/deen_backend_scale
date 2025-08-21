// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import { JWT_SECRET } from "../utils/constant";
import logger from "../utils/logger";

export interface AuthRequest extends Request {
  user?: any;
}
//sdaf
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
      const verified = await jose.jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      req.user = verified.payload;

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    logger.error("Token validation error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
