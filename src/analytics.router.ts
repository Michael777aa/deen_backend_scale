import express from "express";
import { isAuthenticated } from "./libs/utils/auth";
import { authorizeRoles } from "./controllers/member.controller";
import {
  getCoursesAnalytics,
  getOrderAnalytics,
  getUsersAnalytics,
} from "./controllers/analytics.controller";

const analyticsRouter = express.Router();

/** Course **/

analyticsRouter.get("/get-users-analytics", getUsersAnalytics);
analyticsRouter.get("/get-courses-analytics", getCoursesAnalytics);
analyticsRouter.get("/get-orders-analytics", getOrderAnalytics);
export default analyticsRouter;
