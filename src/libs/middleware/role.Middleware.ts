// src/middleware/roleMiddleware.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    if (!roles.includes(req.user.type)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
        success: false,
      });
    }

    next();
  };
};
