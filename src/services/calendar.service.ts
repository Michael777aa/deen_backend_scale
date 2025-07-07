import CalendarModel from "../schema/Calendar.model";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Error";
import {
  Calendar,
  CalendarInput,
  CalendarUpdateInput,
  Event,
  EventInput,
  EventUpdateInput,
} from "../libs/types/calendar";

class CalendarService {
  private readonly calendarModel = CalendarModel;

  public async getAllCalendars(): Promise<Calendar[]> {
    return await this.calendarModel.find().exec();
  }

  public async getCalendarById(id: string): Promise<Calendar> {
    const calendarId = shapeIntoMongooseObjectId(id);
    const result = await this.calendarModel.findById(calendarId).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async getUserCalendars(userId: string): Promise<Calendar[]> {
    const userObjectId = shapeIntoMongooseObjectId(userId);
    return await this.calendarModel.find({ owner: userObjectId }).exec();
  }

  public async createCalendar(input: CalendarInput): Promise<Calendar> {
    try {
      return await this.calendarModel.create(input);
    } catch (err) {
      console.error("CalendarService.createCalendar error:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateCalendar(
    id: string,
    input: CalendarUpdateInput
  ): Promise<Calendar> {
    const calendarId = shapeIntoMongooseObjectId(id);
    const result = await this.calendarModel
      .findByIdAndUpdate(calendarId, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async deleteCalendar(id: string): Promise<void> {
    const calendarId = shapeIntoMongooseObjectId(id);
    const result = await this.calendarModel
      .findByIdAndDelete(calendarId)
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
  }

  // Event-related services
  public async getCalendarEvents(calendarId: string): Promise<Event[]> {
    const calId = shapeIntoMongooseObjectId(calendarId);
    const calendar = await this.calendarModel.findById(calId).exec();
    if (!calendar) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return calendar.events || [];
  }

  public async createEvent(
    calendarId: string,
    input: EventInput
  ): Promise<Calendar> {
    const calId = shapeIntoMongooseObjectId(calendarId);
    const event = {
      ...input,
      _id: new this.calendarModel.base.Types.ObjectId(),
    };

    const updatedCalendar = await this.calendarModel
      .findByIdAndUpdate(calId, { $push: { events: event } }, { new: true })
      .exec();

    if (!updatedCalendar) {
      throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    }
    return updatedCalendar;
  }

  public async updateEvent(
    calendarId: string,
    eventId: string,
    input: EventUpdateInput
  ): Promise<Calendar> {
    const calId = shapeIntoMongooseObjectId(calendarId);
    const evId = shapeIntoMongooseObjectId(eventId);

    const updateObject: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(input)) {
      updateObject[`events.$.${key}`] = value;
    }

    const updatedCalendar = await this.calendarModel
      .findOneAndUpdate(
        { _id: calId, "events._id": evId },
        { $set: updateObject },
        { new: true }
      )
      .exec();

    if (!updatedCalendar) {
      throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    }
    return updatedCalendar;
  }

  public async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    const calId = shapeIntoMongooseObjectId(calendarId);
    const evId = shapeIntoMongooseObjectId(eventId);

    const result = await this.calendarModel
      .findByIdAndUpdate(
        calId,
        { $pull: { events: { _id: evId } } },
        { new: true }
      )
      .exec();

    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
  }
}

export default CalendarService;
