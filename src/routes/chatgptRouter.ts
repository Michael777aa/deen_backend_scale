import express from "express";
import chatgptController from "../controllers/chatgpt.controller";
import multer from "multer";
import makeUpLoader from "../libs/utils/uploader";
const upload = multer({ dest: "uploads/" }); // Temp dir

const chatgptRouter = express.Router();

/** Islamic app **/

chatgptRouter.post("/analyze", chatgptController.analyze);
chatgptRouter.post(
  "/analyze/voice",

  makeUpLoader("audio").single("audio"),
  chatgptController.analyzeVoice
);

export default chatgptRouter;
