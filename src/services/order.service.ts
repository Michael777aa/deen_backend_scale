import { Response } from "express";
import { CatchAsyncError } from "../libs/utils/catchAsyncErrors";
//@ts-nocheck
import OrderModel from "../schema/Order.Model";
// create new order
const orderModel = OrderModel;

export const newOrder = CatchAsyncError(async (data: any, res: Response) => {
  const order = await orderModel.create(data);

  res.status(201).json({
    success: true,
    order,
  });
});

// get all orders

export const getAllOrdersService = async (res: Response) => {
  const orders = await orderModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    orders,
  });
};
