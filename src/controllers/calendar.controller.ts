import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import CalendarService from "../services/calendar.service";

const calendarService = new CalendarService();
const calendarController: T = {};

calendarController.getAllCalendars = async (req: Request, res: Response) => {
  try {
    const calendars = await calendarService.getAllCalendars();
    res.status(HttpCode.OK).json(calendars);
  } catch (err) {
    console.error("Error getAllCalendars:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

calendarController.getCalendarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const calendar = await calendarService.getCalendarById(id);
    res.status(HttpCode.OK).json(calendar);
  } catch (err) {
    console.error("Error getCalendarById:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

calendarController.getUserCalendars = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const calendars = await calendarService.getUserCalendars(userId);
    res.status(HttpCode.OK).json(calendars);
  } catch (err) {
    console.error("Error getUserCalendars:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

calendarController.createCalendar = async (req: Request, res: Response) => {
  try {
    const input = req.body;
    console.log("REQ BODY", req.body);

    const newCalendar = await calendarService.createCalendar(input);
    res.status(HttpCode.CREATED).json(newCalendar);
  } catch (err) {
    console.error("Error createCalendar:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

calendarController.updateCalendar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const input = req.body;
    const updatedCalendar = await calendarService.updateCalendar(id, input);
    res.status(HttpCode.OK).json(updatedCalendar);
  } catch (err) {
    console.error("Error updateCalendar:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

calendarController.deleteCalendar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await calendarService.deleteCalendar(id);
    res.status(HttpCode.OK).json({ message: "Calendar deleted successfully" });
  } catch (err) {
    console.error("Error deleteCalendar:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

// Event-related controllers
calendarController.getCalendarEvents = async (req: Request, res: Response) => {
  try {
    const { calendarId } = req.params;
    const events = await calendarService.getCalendarEvents(calendarId);
    res.status(HttpCode.OK).json(events);
  } catch (err) {
    console.error("Error getCalendarEvents:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

calendarController.createEvent = async (req: Request, res: Response) => {
  try {
    const { calendarId } = req.params;
    const input = req.body;
    const newEvent = await calendarService.createEvent(calendarId, input);
    res.status(HttpCode.CREATED).json(newEvent);
  } catch (err) {
    console.error("Error createEvent:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

calendarController.updateEvent = async (req: Request, res: Response) => {
  try {
    const { calendarId, eventId } = req.params;
    const input = req.body;
    const updatedEvent = await calendarService.updateEvent(
      calendarId,
      eventId,
      input
    );
    res.status(HttpCode.OK).json(updatedEvent);
  } catch (err) {
    console.error("Error updateEvent:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

calendarController.deleteEvent = async (req: Request, res: Response) => {
  try {
    const { calendarId, eventId } = req.params;
    await calendarService.deleteEvent(calendarId, eventId);
    res.status(HttpCode.OK).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleteEvent:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default calendarController;
