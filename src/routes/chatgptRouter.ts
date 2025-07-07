import express from "express";
import chatgptController from "../controllers/chatgpt.controller";
const chatgptRouter = express.Router();

/** Mental Health **/

chatgptRouter.post("/analyze", chatgptController.analyze);

export default chatgptRouter;
