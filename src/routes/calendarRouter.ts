import express from "express";

const calendarRouter = express.Router();

calendarRouter.get("/calendar");
calendarRouter.get("/calendar/events");

export default calendarRouter;
