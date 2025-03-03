import express from "express";
import { isAuthenticated } from "./libs/utils/auth";
import {
  authorizeRoles,
  updateAccessToken,
} from "./controllers/member.controller";
import {
  createOrder,
  getAllOrders,
  newPayment,
  sendStripePublishableKey,
} from "./controllers/order.controller";

const orderRouter = express.Router();

/** Course **/

orderRouter.post(
  "/create-order",
  updateAccessToken,
  isAuthenticated,
  createOrder
);
orderRouter.get(
  "/get-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);
orderRouter.post("/payment", isAuthenticated, newPayment);
export default orderRouter;
