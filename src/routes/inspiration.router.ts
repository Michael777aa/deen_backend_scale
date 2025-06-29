import express from "express";
import inspirationController from "../controllers/inspiration.controller";

const inspirationRouter = express.Router();

inspirationRouter.get("/daily", inspirationController.getDailyInspiration);
inspirationRouter.post("/create", inspirationController.createNewInspiration);
inspirationRouter.post("/:id", inspirationController.updateChosenInspiration);

export default inspirationRouter;
