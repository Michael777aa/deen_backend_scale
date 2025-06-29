// src/controllers/layout.controller.ts
import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import { LayoutInput, LayoutUpdateInput } from "../libs/types/layout";
import LayoutService from "../services/layout.service";

/**********************   
    LAYOUT HOMEPAGE
**********************/

const layoutService = new LayoutService();
const layoutController: T = {};

layoutController.getLayout = async (req: Request, res: Response) => {
  try {
    const data = await layoutService.getLayout();
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getLayout:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};
layoutController.createNewLayout = async (req: Request, res: Response) => {
  try {
    const input: LayoutInput = req.body;
    const files = req.files as Express.Multer.File[];
    input.layoutImages = files.map((file) => file.path);
    const result = await layoutService.createNewLayout(input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error createNewLayout:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
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
    console.error("Error updateChosenLayout:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default layoutController;
