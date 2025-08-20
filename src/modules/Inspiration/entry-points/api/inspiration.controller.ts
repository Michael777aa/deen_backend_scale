import { Request, Response } from "express";
import Errors, { HttpCode } from "../../../../libs/Error";
import { T } from "../../../../libs/common";
import InspirationService from "../../domain/inspiration.service";

/**********************   
    DAILY INSPIRATION
**********************/

const inspirationService = new InspirationService();
const inspirationController: T = {};

inspirationController.getDailyInspiration = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await inspirationService.getDailyInspiration();
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getDailyInspiration:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

inspirationController.createNewInspiration = async (
  req: Request,
  res: Response
) => {
  try {
    const input = req.body;
    const result = await inspirationService.createNewInspiration(input);
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error createNewInspiration:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

inspirationController.updateChosenInspiration = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const input = req.body;
    const result = await inspirationService.updateChosenInspiration(id, input);
    res
      .status(HttpCode.OK)
      .json({ message: "Successfully updated", data: result });
  } catch (err) {
    console.error("Error updateChosenInspiration:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default inspirationController;
