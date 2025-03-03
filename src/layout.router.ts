import express from "express";
import { isAuthenticated } from "./libs/utils/auth";
import {
  authorizeRoles,
  updateAccessToken,
} from "./controllers/member.controller";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "./controllers/layout.controller";

const layoutRouter = express.Router();

/** Course **/

layoutRouter.post(
  "/create-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  createLayout
);

layoutRouter.post(
  "/edit-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editLayout
);
layoutRouter.get("/get-layout/:type", getLayoutByType);
export default layoutRouter;
