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
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10); // in minutes ✅
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "7",
  10
); // in days ✅

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), // ✅ Convert minutes to ms
  maxAge: accessTokenExpire * 60 * 1000, // ✅ Convert minutes to ms
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // ✅ Days → ms
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // ✅ Convert days to ms
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  try {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Upload session to Redis with 7 days expiry
    redis.set(
      user._id.toString(),
      JSON.stringify(user),
      "EX",
      60 * 60 * 24 * 7
    ); // Ensure `_id` is a string

    // Only set `secure` in production
    if (process.env.NODE_ENV === "production") {
      accessTokenOptions.secure = true;
    }

    // Set cookies
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Error while generating tokens:", error);
    res.status(500).json({
      success: false,
      message: "Error while generating access token",
    });
  }
};
