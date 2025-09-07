// src/controllers/layout.controller.ts
import { Request, Response } from "express";
import LayoutService from "../../domain/layout.service";
import { T } from "../../../../libs/common";
import { HttpCode } from "../../../../libs/Error";
import logger from "../../../../libs/utils/logger";
import { LayoutInput, LayoutUpdateInput } from "../../domain/layout.dto";

/**********************   
    LAYOUT HOMEPAGE
**********************/

const layoutService = new LayoutService();
const layoutController: T = {};

layoutController.getLayout = async (req: Request, res: Response) => {
  try {
    const data = await layoutService.getLayout();
    console.log("DATA", data);

    res.status(HttpCode.OK).json(data);
  } catch (err: any) {
    logger.error("Error getLayout:", err);
    res.status(500).json({
      success: false,
      message: "Error on getLayout",
    });
  }
};
layoutController.createNewLayout = async (req: Request, res: Response) => {
  try {
    const input: LayoutInput = req.body;
    const files = req.files as Express.Multer.File[];
    input.layoutImages = files.map((file) => file.path);
    const result = await layoutService.createNewLayout(input);
    res.status(HttpCode.CREATED).json(result);
  } catch (err: any) {
    logger.error("Error createNewLayout:", err);
    res.status(500).json({
      success: false,
      message: "Error on createNewLayout",
    });
  }
};

layoutController.updateChosenLayout = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const input: LayoutUpdateInput = req.body;
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      input.layoutImages = files.map((file) => file.path);
    }
    const result = await layoutService.updateChosenLayout(id, input);
    res
      .status(HttpCode.OK)
      .json({ message: "Successfully updated", data: result });
  } catch (err) {
    logger.error("Error updateChosenLayout:", err);
    res.status(500).json({
      success: false,
      message: "Error on updateChosenLayout",
    });
  }
};

export default layoutController;
