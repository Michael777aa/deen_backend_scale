import mongoose, { Schema } from "mongoose";
import { Stream } from "../domain/stream.dto";
import { StreamStatus, StreamType } from "../domain/enum";
const streamSchema = new Schema<Stream>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    center: { type: String, required: true },
    imam: { type: String, required: true },
    currentViewers: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(StreamStatus),
      default: StreamStatus.UPCOMING,
    },
    type: {
      type: String,
      enum: Object.values(StreamType),
      required: true,
    },
    scheduledStartTime: { type: Date, required: true },
    actualStartTime: { type: Date },
    endTime: { type: Date },
    tags: { type: [String], default: [] },
    thumbnailUrl: { type: String },
    streamUrl: { type: String },
    playbackId: { type: String },
    muxStreamId: { type: String },
    rtmpUrl: { type: String },
    streamKey: { type: String },
    playbackUrl: { type: String },
    chatEnabled: { type: Boolean, default: true },
    isPrivate: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },

    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },

  { timestamps: true }
);

const streamModel = mongoose.model<Stream>("Stream", streamSchema);
export default streamModel;
