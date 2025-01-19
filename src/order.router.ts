import express from "express";
import { isAuthenticated } from "./libs/utils/auth";
import { authorizeRoles } from "./controllers/member.controller";
import { createOrder, getAllOrders } from "./controllers/order.controller";

const orderRouter = express.Router();

/** Course **/

orderRouter.post("/create-order", isAuthenticated, createOrder);
orderRouter.get(
  "/get-orders",
  isAuthenticated,
  // authorizeRoles("admin"),
  getAllOrders
);
export default orderRouter;
