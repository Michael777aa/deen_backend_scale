import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import { AdminRequest } from "../libs/types/member";
import { EventInput } from "../libs/types/event";
import EventService from "../models/Event.service";

const eventService = new EventService();

const eventController: T = {};

/**********************   
          SPA
**********************/
eventController.getEvents = async (req: Request, res: Response) => {
  try {
    console.log("getEvents");
    const data = await eventService.getEvents();

    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.log("Error, getEvents", err);
    if (err instanceof Errors) {
      res.status(err.code).json({ message: err.message });
    } else {
      res.status(Errors.standard.code).json({
        message: Errors.standard.message,
      });
    }
  }
};

/**********************   
          BSSR
**********************/

eventController.getAllEvents = async (req: Request, res: Response) => {
  try {
    console.log("getAllEvents");
    const data = await eventService.getAllEvents();

    res.render("event", { events: data });
  } catch (err) {
    console.log("Error, getAllEvents", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

eventController.createNewEvent = async (req: AdminRequest, res: Response) => {
  try {
    if (!req.files?.length) {
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
    }

    const data: EventInput = req.body;
    data.eventImages = req.files?.map((ele) => {
      return ele.path;
    });

    await eventService.createNewEvent(data);

    res.send(
      `<script> alert("Sucessfully creation!"); window.location.replace('/admin/event/all');</script>`
    );
  } catch (err) {
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.replace("/admin/event/all");</script>`
    );
  }
};
eventController.updateChosenEvent = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenEvent");

    const id = req.params.id;

    const result = await eventService.updateChosenEvent(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenEvent", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default eventController;
