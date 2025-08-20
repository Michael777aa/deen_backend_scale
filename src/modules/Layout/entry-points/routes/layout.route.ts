import express from "express";
import makeUploader from "../../../../libs/utils/uploader";
import { validateToken } from "../../../../libs/middleware/authMiddleware";
import { authorizeRoles } from "../../../../libs/middleware/role.Middleware";
import layoutController from "../api/layout.controller";
const layoutRouter = express.Router();

layoutRouter.get("/", layoutController.getLayout);
layoutRouter.post(
  "/create",
  validateToken,
  authorizeRoles("ADMIN"),
  makeUploader("layout").array("layoutImages", 5),
  layoutController.createNewLayout
);
layoutRouter.post(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN"),
  makeUploader("layout").array("layoutImages", 5),
  layoutController.updateChosenLayout
);
export default layoutRouter;
