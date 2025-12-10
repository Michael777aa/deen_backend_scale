import { Request, Response } from "express";
import Errors, { HttpCode } from "../../../../libs/Error";
import { T } from "../../../../libs/common";
import DuaService from "../../domain/duas.service";
import logger from "../../../../libs/utils/logger";

const duaService = new DuaService();
const duaController: T = {};

/**********************
        GET ALL
**********************/
duaController.getAllDuas = async (req: Request, res: Response) => {
  try {
    const data = await duaService.getAllDuas();
    res.status(HttpCode.OK).json(data);
  } catch (err: any) {
    logger.error("Error in getAllDuas:", err);
    res.status(500).json({
      success: false,
      message: "Error in getAllDuas",
    });
  }
};

/**********************
        GET BY ID
**********************/
duaController.getDuaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await duaService.getDuaById(id);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    logger.error("Error in getDuaById:", err);
    res.status(500).json({
      success: false,
      message: "Error in getDuaById",
    });
  }
};

/**********************
   GET BY CATEGORY
**********************/
duaController.getDuasByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const data = await duaService.getDuasByCategory(categoryId);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    logger.error("Error in getDuasByCategory:", err);
    res.status(500).json({
      success: false,
      message: "Error in getDuasByCategory",
    });
  }
};

/**********************
        CREATE
**********************/
duaController.createNewDua = async (req: Request, res: Response) => {
  try {
    const result = await duaService.createNewDua(req.body);
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    logger.error("Error in createNewDua:", err);
    res.status(500).json({
      success: false,
      message: "Error in createNewDua",
    });
  }
};

/**********************
        UPDATE
**********************/
duaController.updateDua = async (req: Request, res: Response) => {
  try {
    const result = await duaService.updateDua(req.params.id, req.body);
    res
      .status(HttpCode.OK)
      .json({ message: "Updated successfully", data: result });
  } catch (err) {
    logger.error("Error in updateDua:", err);
    res.status(500).json({
      success: false,
      message: "Error in updateDua",
    });
  }
};

/**********************
        DELETE
**********************/
duaController.deleteDua = async (req: Request, res: Response) => {
  try {
    await duaService.deleteDua(req.params.id);
    res.status(HttpCode.OK).json({ message: "Deleted successfully" });
  } catch (err) {
    logger.error("Error in deleteDua:", err);
    res.status(500).json({
      success: false,
      message: "Error in deleteDua",
    });
  }
};

export default duaController;
