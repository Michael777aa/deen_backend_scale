import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import PrayerService from "../services/prayer.service";

/**********************   
      PRAYER TIMES
**********************/

const prayerService = new PrayerService();
const prayerController: T = {};

prayerController.getPrayerTimes = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REQUEST);
    }

    const data = await prayerService.getPrayerTimes(
      Number(latitude),
      Number(longitude)
    );
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error, getPrayerTimes:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err.message);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
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
  } catch (err) {
    console.error("Error, getNextPrayer:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default prayerController;
