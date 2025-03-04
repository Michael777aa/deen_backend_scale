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

layoutRouter.post("/create-layout", createLayout);

layoutRouter.post("/edit-layout", updateAccessToken, editLayout);
layoutRouter.get("/get-layout/:type", getLayoutByType);
export default layoutRouter;
