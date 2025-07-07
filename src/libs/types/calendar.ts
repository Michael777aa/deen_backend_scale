import { ObjectId } from "mongoose";

export interface Calendar {
  _id: ObjectId;
  name: string;
  description?: string;
  owner: ObjectId;
  color: string;
  isPublic: boolean;
  timeZone: string;
  events: Event[];
  sharedWith: SharedCalendar[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarInput {
  name: string;
  description?: string;
  owner: ObjectId;
  color?: string;
  isPublic?: boolean;
  timeZone?: string;
}

export interface CalendarUpdateInput {
  name?: string;
  description?: string;
  color?: string;
  isPublic?: boolean;
  timeZone?: string;
}

export interface Event {
  _id: ObjectId;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: ObjectId[];
  isAllDay?: boolean;
  recurrenceRule?: string;
  color?: string;
  isCancelled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventInput {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: ObjectId[];
  isAllDay?: boolean;
  recurrenceRule?: string;
  color?: string;
}

export interface EventUpdateInput {
  title?: string;
  description?: string;
  start?: Date;
  end?: Date;
  location?: string;
  attendees?: ObjectId[];
  isAllDay?: boolean;
  recurrenceRule?: string;
  color?: string;
  isCancelled?: boolean;
}

export interface SharedCalendar {
  user: ObjectId;
  permission: "view" | "edit";
}
