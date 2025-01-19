import express from "express";
import { isAuthenticated } from "./libs/utils/auth";
import { authorizeRoles } from "./controllers/member.controller";
import { createOrder } from "./controllers/order.controller";

const orderRouter = express.Router();

/** Course **/

orderRouter.post("/create-order", isAuthenticated, createOrder);

export default orderRouter;
