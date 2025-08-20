import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../../../../libs/Error";
import { T } from "../../../../libs/common";
import PrayerService from "../../domain/prayer.service";
import logger from "../../../../libs/utils/logger";

/**********************   
      PRAYER TIMES
**********************/

const prayerService = new PrayerService();
const prayerController: T = {};

prayerController.getPrayerTimes = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;
    console.log("REQUEST QUERY", req.query);

    if (!latitude || !longitude) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REQUEST);
    }

    const data = await prayerService.getPrayerTimes(
      Number(latitude),
      Number(longitude)
    );
    res.status(HttpCode.OK).json(data);
  } catch (err: any) {
    logger.error("Error, getPrayerTimes:", err);
    res.status(500).json({
      success: false,
      message: "Error on getPrayerTimes",
    });
  }
};

prayerController.getNextPrayer = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REQUEST);
    }

    const data = await prayerService.getNextPrayer(
      Number(latitude),
      Number(longitude)
    );
    res.status(HttpCode.OK).json(data);
  } catch (err: any) {
    logger.error("Error, getNextPrayer:", err);
    res.status(500).json({
      success: false,
      message: "Error on getNextPrayer",
    });
  }
};

export default prayerController;
