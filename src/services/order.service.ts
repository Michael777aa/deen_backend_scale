import { Response } from "express";
import { CatchAsyncError } from "../libs/utils/catchAsyncErrors";
import OrderModel from "../schema/Order.Model";
// create new order

export const newOrder = CatchAsyncError(async (data: any, res: Response) => {
  const order = await OrderModel.create(data);

  res.status(201).json({
    success: true,
    order,
  });
});
