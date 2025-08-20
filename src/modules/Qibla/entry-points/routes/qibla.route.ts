import express from "express";
import qiblaController from "../api/qibla.controller";
import { validateToken } from "../../../../libs/middleware/authMiddleware";

const qiblaRouter = express.Router();

qiblaRouter.get(
  "/direction",
  //validateToken,
  qiblaController.getQiblaDirection
);

export default qiblaRouter;
