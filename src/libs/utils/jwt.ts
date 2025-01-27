// import { Response } from "express";
// import { IUser } from "../../schema/Member.model";
// import { redis } from "../../redis";

// interface ITokenOptions {
//   expires: Date;
//   maxAge: number;
//   httpOnly: boolean;
//   sameSite: "lax" | "strict" | "none" | undefined;
//   secure?: boolean;
// }
// // parse environment variables to integrae with fallback values

// const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10); // in minutes ✅
// const refreshTokenExpire = parseInt(
//   process.env.REFRESH_TOKEN_EXPIRE || "7",
//   10
// ); // in days ✅

// export const accessTokenOptions: ITokenOptions = {
//   expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // ✅ Hours → ms
//   maxAge: accessTokenExpire * 60 * 60 * 1000, // ✅ Convert hours to ms
//   httpOnly: true,
//   sameSite: "lax",
// };

// export const refreshTokenOptions: ITokenOptions = {
//   expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // ✅ Days → ms
//   maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // ✅ Convert days to ms
//   httpOnly: true,
//   sameSite: "lax",
// };

// export const sendToken = (user: IUser, statusCode: number, res: Response) => {
//   const accessToken = user.SignAccessToken();
//   const refreshToken = user.SignRefreshToken();

//   // upload session to redis
//   redis.set(user._id, JSON.stringify(user), "EX", 60 * 60 * 24 * 7); // Expires in 7 days

//   // only set secure to rue in production

//   if (process.env.NODE_ENV === "production") {
//     accessTokenOptions.secure = true;
//   }

//   res.cookie("access_token", accessToken, accessTokenOptions);
//   res.cookie("refresh_token", refreshToken, refreshTokenOptions);

//   res.status(statusCode).json({
//     success: true,
//     user,
//     accessToken,
//   });
// };
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
// parse environment variables to integrae with fallback values

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10); // in minutes ✅
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "7",
  10
); // in days ✅

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // ✅ Hours → ms
  maxAge: accessTokenExpire * 60 * 60 * 1000, // ✅ Convert hours to ms
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
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // upload session to redis
  redis.set(user._id, JSON.stringify(user), "EX", 60 * 60 * 24 * 7); // Expires in 7 days

  // only set secure to rue in production

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
