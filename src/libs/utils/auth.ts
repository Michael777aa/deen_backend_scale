import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../../redis";
import { IUser } from "../../schema/Member.model";
import ErrorHandler from "../Error";

// authenticated user
export const isAuthenticated = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(new ErrorHandler("No access token found", 401));
    }

    try {
      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;

      const user = await redis.get(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 401));
      }

      req.user = JSON.parse(user); // Attach user to request object
      next();
    } catch (error) {
      return next(new ErrorHandler("Invalid or expired token", 401));
    }
  }
);
