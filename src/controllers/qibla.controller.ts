import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import QiblaService from "../services/qibla.service";

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
  } catch (err) {
    console.error("Error, getQiblaDirection:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err.message);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default qiblaController;
