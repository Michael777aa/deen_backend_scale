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

// Parse environment variables with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10); // in minutes
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "7",
  10
); // in days

// Define token options for access and refresh tokens
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // Convert minutes to ms
  maxAge: accessTokenExpire * 60 * 60 * 1000, // Convert minutes to ms
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // Convert days to ms
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // Convert days to ms
  httpOnly: true,
  sameSite: "lax",
};

// Send the tokens to the client
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  // Generate access and refresh tokens using user's methods
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Upload session data to Redis with a 7-day expiration
  redis.set(user._id.toString(), JSON.stringify(user), "EX", 60 * 60 * 24 * 7); // Expires in 7 days

  // Set the secure flag for cookies only in production environment
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  // Set the cookies in the response
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Respond with the tokens and user data
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
