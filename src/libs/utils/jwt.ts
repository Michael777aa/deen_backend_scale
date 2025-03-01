import { Response } from "express";
import { IUser } from "../../schema/Member.model";
import { redis } from "../../redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse environment variables to integrate with fallback values

// Set expiry to 30 days
const accessTokenExpire = 30; // 30 days in days
const refreshTokenExpire = 30; // 30 days in days

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 24 * 60 * 60 * 1000), // 30 days → ms
  maxAge: accessTokenExpire * 24 * 60 * 60 * 1000, // 30 days → ms
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // 30 days → ms
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // 30 days → ms
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // upload session to redis
  redis.set(user._id, JSON.stringify(user), "EX", 60 * 60 * 24 * 7); // Expires in 7 days (could be adjusted if necessary)

  // only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  // Set cookies with new expiry options
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Return the response with the tokens
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
