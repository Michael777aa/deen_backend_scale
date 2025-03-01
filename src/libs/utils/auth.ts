import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../../redis";
import { IUser } from "../../schema/Member.model";

// authenticated user
export const isAuthenticated = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    const access_token = req.cookies.access_token;

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    const user: any = await redis.get(decoded.id);

    req.user = JSON.parse(user); // ✅ Now TypeScript should recognize `req.user`

    next();
  }
);
