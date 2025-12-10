import express from "express";
import streamController from "../api/stream.controller";

const streamRouter = express.Router();

// Stream routes

// Stream routes
streamRouter.post("/streams/create", streamController.createNewStream);
streamRouter.post("/streams/update/:id", streamController.updateChosenStream);
streamRouter.post("/streams/delete/:id", streamController.deleteChosenStream);

streamRouter.get("/streams/live", streamController.getLiveStreams);
streamRouter.get("/streams/upcoming", streamController.getUpcomingStreams);
streamRouter.get("/streams/recorded", streamController.getRecordedStreams);
streamRouter.get("/streams/type/:type", streamController.getStreamsByType);
streamRouter.get("/streams", streamController.getAllStreams);
streamRouter.get("/streams/:id", streamController.getStreamById);

streamRouter.post("/streams/:id/start", streamController.startStream);
streamRouter.post("/streams/:id/end", streamController.endStream);

streamRouter.post("/streams/:id/comment", streamController.addComment);

streamRouter.post("/streams/:id/like", streamController.likeStream);
streamRouter.post("/streams/quick-start", streamController.quickStart);

export default streamRouter;
