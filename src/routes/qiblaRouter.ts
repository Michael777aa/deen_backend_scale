import express from "express";
import qiblaController from "../controllers/qibla.controller";

const qiblaRouter = express.Router();

qiblaRouter.get("/direction", qiblaController.getQiblaDirection);

export default qiblaRouter;
