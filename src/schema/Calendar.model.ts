import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    location: String,
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isAllDay: {
      type: Boolean,
      default: false,
    },
    recurrenceRule: String, // For recurring events
    color: String, // Event color
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const calendarSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      default: "#3b82f6", // Default blue color
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    timeZone: {
      type: String,
      default: "UTC",
    },
    events: [eventSchema],
    sharedWith: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
  },
  { timestamps: true }
);

calendarSchema.index({ name: 1, owner: 1 }, { unique: true });

export default mongoose.model("Calendar", calendarSchema);
