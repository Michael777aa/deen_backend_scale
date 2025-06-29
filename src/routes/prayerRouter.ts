import express from "express";
import prayerController from "../controllers/prayer.controller";

const prayerRouter = express.Router();

prayerRouter.get("/prayer-times", prayerController.getPrayerTimes);
prayerRouter.get("/prayer-times/next", prayerController.getNextPrayer);

export default prayerRouter;
