import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../Error";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../../redis";
import { IUser } from "../../schema/Member.model";

// authenticated user
// Ensure this is correctly imported for your user model

// Authentication Middleware
export const isAuthenticated = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    // Get the access token from cookies
    const access_token = req.cookies.access_token;

    // If no access token is provided
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    // Verify the access token
    let decoded: JwtPayload | null = null;
    try {
      decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
      ) as JwtPayload;
    } catch (error) {
      return next(
        new ErrorHandler("Access token is not valid or expired", 400)
      );
    }

    // If decoded data is invalid
    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    // Retrieve the user session from Redis
    const user = await redis.get(decoded.id as string);
    if (!user) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    // Attach the user object to the request
    req.user = JSON.parse(user);

    // Continue with the next middleware
    next();
  }
);
