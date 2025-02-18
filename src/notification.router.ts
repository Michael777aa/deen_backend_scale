import express from "express";
import { isAuthenticated } from "./libs/utils/auth";
import { authorizeRoles } from "./controllers/member.controller";
import {
  getNotifications,
  updateNotification,
} from "./controllers/notification.controller";

const notificationRouter = express.Router();

/** Course **/

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);
notificationRouter.post(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);
export default notificationRouter;
