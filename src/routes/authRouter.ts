// Express.js Social authentication routes for Google, Kakao, and Naver,
// including user info and token refresh endpoints.
import express from "express";
import authController from "../controllers/auth.controller";

const authRouter = express.Router();

// Google Auth Routes
authRouter.get("/google/authorize", authController.googleAuthorizeHandler);
authRouter.get("/google/callback", authController.googleCallbackHandler);
authRouter.post("/google/token", authController.googleTokenHandler);

// Kakao Auth Routes
authRouter.get("/kakao/authorize", authController.kakaoAuthorizeHandler);
authRouter.get("/kakao/callback", authController.kakaoCallbackHandler);
authRouter.post("/kakao/token", authController.kakaoTokenHandler);

// Naver Auth Routes
authRouter.get("/naver/authorize", authController.naverAuthorizeHandler);
authRouter.get("/naver/callback", authController.naverCallbackHandler);
authRouter.post("/naver/token", authController.naverTokenHandler);

// Common Auth Routes
authRouter.post("/refresh", authController.refreshTokenHandler);
authRouter.get("/user", authController.userInfoHandler);

export default authRouter;
