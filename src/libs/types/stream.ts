import { ObjectId } from "mongoose";
import { StreamStatus, StreamType } from "../enums/stream.enum";

export interface Stream {
  _id: ObjectId;
  title: string;
  description: string;
  center: string;
  imam: string;
  currentViewers: number;
  status: StreamStatus;
  type: StreamType;
  scheduledStartTime: Date;
  actualStartTime?: Date;
  endTime?: Date;
  tags: string[];
  thumbnailUrl?: string;
  streamUrl: string;
  rtmpUrl: string;
  streamKey: string;
  playbackUrl: string;
  chatEnabled: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  playbackId?: string;
  muxStreamId?: string;
  likes: number;
  comments: Comment[];
  views: number;
}

export interface Comment {
  userId: ObjectId;
  text: string;
  createdAt: Date;
}

export interface StreamInput {
  title: string;
  description: string;
  center?: string;
  imam: string;
  status?: StreamStatus;
  type: StreamType;
  scheduledStartTime: Date;
  tags?: string[];
  thumbnailUrl?: string;
  chatEnabled?: boolean;
  isPrivate?: boolean;
}

export interface StreamUpdateInput {
  title?: string;
  description?: string;
  center?: string;
  imam?: string;
  status?: StreamStatus;
  type?: StreamType;
  scheduledStartTime?: Date;
  tags?: string[];
  thumbnailUrl?: string;
  chatEnabled?: boolean;
  isPrivate?: boolean;
}

export interface StreamInquiry {
  order: string;
  page: number;
  limit: number;
  streamType?: StreamType;
  search?: string;
  status?: StreamStatus;
}
