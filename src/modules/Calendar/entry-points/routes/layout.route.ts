import express from "express";
import prayerController from "../api/prayer.controller";
import { validateToken } from "../../../../libs/middleware/authMiddleware";

const prayerRouter = express.Router();

prayerRouter.get(
  "/prayer-times",
  validateToken,
  prayerController.getPrayerTimes
);
prayerRouter.get(
  "/prayer-times/next",
  validateToken,
  prayerController.getNextPrayer
);

export default prayerRouter;
