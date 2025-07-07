import express from "express";
import calendarController from "../controllers/calendar.controller";

const calendarRouter = express.Router();

calendarRouter.get("/", calendarController.getAllCalendars);
calendarRouter.get("/:id", calendarController.getCalendarById);
calendarRouter.get("/user/:userId", calendarController.getUserCalendars);
calendarRouter.post("/create", calendarController.createCalendar);
calendarRouter.put("/:id", calendarController.updateCalendar);
calendarRouter.delete("/:id", calendarController.deleteCalendar);

// Events routes
calendarRouter.get("/:calendarId/events", calendarController.getCalendarEvents);
calendarRouter.post("/:calendarId/events", calendarController.createEvent);
calendarRouter.put(
  "/:calendarId/events/:eventId",
  calendarController.updateEvent
);
calendarRouter.delete(
  "/:calendarId/events/:eventId",
  calendarController.deleteEvent
);

export default calendarRouter;
