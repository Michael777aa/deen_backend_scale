import express from "express";
import prayerController from "../api/prayer.controller";
import { validateToken } from "../../../../libs/middleware/authMiddleware";

const prayerRouter = express.Router();

prayerRouter.get("/prayer-times", prayerController.getPrayerTimes);
prayerRouter.get("/prayer-times/next", prayerController.getNextPrayer);
prayerRouter.get("/mosques", prayerController.getMosques);

export default prayerRouter;
