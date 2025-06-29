import express from "express";
import layoutController from "../controllers/layout.controller";
import makeUploader from "../libs/utils/uploader";
const layoutRouter = express.Router();

layoutRouter.get("/current", layoutController.getLayout);
layoutRouter.post(
  "/create",
  makeUploader("layout").array("layoutImages", 5),
  layoutController.createNewLayout
);
layoutRouter.post(
  "/:id",
  makeUploader("layout").array("layoutImages", 5),
  layoutController.updateChosenLayout
);
export default layoutRouter;
