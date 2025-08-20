import express from "express";
import makeUpLoader from "../../../../libs/utils/uploader";
import chatgptController from "../api/chatgpt.controller";
import { validateToken } from "../../../../libs/middleware/authMiddleware";

const chatgptRouter = express.Router();

chatgptRouter.post("/analyze", validateToken, chatgptController.analyze);
chatgptRouter.post(
  "/analyze/voice",
  validateToken,
  makeUpLoader("audio").single("audio"),
  chatgptController.analyzeVoice
);

export default chatgptRouter;
