import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../../../../libs/Error";
import QiblaService from "../../domain/qibla.service";
import { T } from "../../../../libs/common";
import logger from "../../../../libs/utils/logger";

/**********************   
      QIBLA COMPASS
**********************/

const qiblaService = new QiblaService();
const qiblaController: T = {};

qiblaController.getQiblaDirection = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REQUEST);
    }

    const data = await qiblaService.getQiblaDirection(
      Number(latitude),
      Number(longitude)
    );

    res.status(HttpCode.OK).json(data);
  } catch (err: any) {
    logger.error("Error, getQiblaDirection:", err);
    res.status(500).json({
      success: false,
      message: "Error on getQiblaDirection",
    });
  }
};

export default qiblaController;
