import express from "express";
import mentalController from "../controllers/mental.controller";
const chatgptRouter = express.Router();

/** Mental Health **/

chatgptRouter.post("/analyze", mentalController.analyze);

export default chatgptRouter;
