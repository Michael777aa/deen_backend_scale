import express from "express";
import { isAuthenticated } from "./libs/utils/auth";
import {
  authorizeRoles,
  updateAccessToken,
} from "./controllers/member.controller";
import {
  getNotifications,
  updateNotification,
} from "./controllers/notification.controller";

const notificationRouter = express.Router();

/** Course **/

notificationRouter.get("/get-all-notifications", getNotifications);
notificationRouter.post("/update-notification/:id", updateNotification);
export default notificationRouter;
