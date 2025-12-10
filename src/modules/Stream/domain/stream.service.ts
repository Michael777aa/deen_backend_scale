import Errors from "../../../libs/Error";
import { shapeIntoMongooseObjectId, Video } from "../../../libs/utils/config";
import streamModel from "../data-access/db";
import { HttpCode } from "../../../libs/Error";
import { Message } from "../../../libs/Error";
import { StreamStatus, StreamType } from "./enum";
import { Stream, StreamInput, StreamUpdateInput } from "./stream.dto";

class StreamService {
  private readonly streamModel = streamModel;

  public async startStream(_id: string): Promise<any> {
    const id = shapeIntoMongooseObjectId(_id);
    const stream = await this.streamModel.findById(id).exec();

    if (!stream) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    try {
      const liveStream: any = await Video.liveStreams.create({
        playback_policy: ["public"],
        new_asset_settings: { playback_policy: ["public"] },
        latency_mode: "low",
      });

      const updatedStream = await this.streamModel
        .findByIdAndUpdate(
          id,
          {
            status: StreamStatus.LIVE,
            actualStartTime: new Date(),
            rtmpUrl: liveStream.rtmp_ingest_url,
            streamKey: liveStream.stream_key,
            playbackId: liveStream.playback_ids?.[0]?.id,
            muxStreamId: liveStream.id,
          },
          { new: true }
        )
        .exec();

      if (!updatedStream) {
        throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
      }
      return updatedStream;
    } catch (err) {
      console.error("Error creating Mux live stream:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async endStream(_id: string): Promise<Stream> {
    const id = shapeIntoMongooseObjectId(_id);
    const stream = await this.streamModel.findById(id).exec();
    if (!stream) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    try {
      const updatedStream = await this.streamModel
        .findByIdAndUpdate(
          id,
          {
            status: StreamStatus.RECORDED,
            endTime: new Date(),
          },
          { new: true }
        )
        .exec();

      if (!updatedStream) {
        throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
      }
      return updatedStream;
    } catch (err) {
      console.error("Error ending stream:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);
    }
  }

  public async getLiveStreams(): Promise<Stream[]> {
    return await this.streamModel
      .find({ status: StreamStatus.LIVE })
      .sort({ actualStartTime: -1 })
      .exec();
  }

  public async getUpcomingStreams(): Promise<Stream[]> {
    return await this.streamModel
      .find({
        status: StreamStatus.UPCOMING,
        scheduledStartTime: { $gt: new Date() },
      })
      .sort({ scheduledStartTime: 1 })
      .exec();
  }

  public async getRecordedStreams(): Promise<Stream[]> {
    return await this.streamModel
      .find({ status: StreamStatus.RECORDED })
      .sort({ endTime: -1 })
      .exec();
  }

  public async getStreamsByType(type: StreamType): Promise<Stream[]> {
    return await this.streamModel
      .find({ type })
      .sort({ actualStartTime: -1 })
      .exec();
  }

  public async likeStream(_id: string): Promise<Stream> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.streamModel
      .findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async addComment(
    _id: string,
    userId: string,
    text: string
  ): Promise<Stream> {
    const id = shapeIntoMongooseObjectId(_id);
    const comment = {
      userId: shapeIntoMongooseObjectId(userId),
      text,
    };

    const result = await this.streamModel
      .findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async getAllStreams(): Promise<Stream[]> {
    const result = await this.streamModel.find().sort({ startTime: -1 }).exec();
    if (!result.length)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async getStreamById(_id: string): Promise<Stream> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.streamModel.findById(id).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createNewStream(input: StreamInput): Promise<Stream> {
    try {
      return await this.streamModel.create(input);
    } catch (err) {
      console.error("StreamService.createNewStream error:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenStream(
    _id: string,
    input: StreamUpdateInput
  ): Promise<Stream> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.streamModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async deleteChosenStream(_id: string): Promise<Stream> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.streamModel.findByIdAndDelete(id).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // In your StreamService - fix the quickStartStream method
  public async quickStartStream(input: StreamInput): Promise<Stream> {
    try {
      // First create the Mux live stream
      const liveStream: any = await Video.liveStreams.create({
        playback_policy: ["public"],
        new_asset_settings: { playback_policy: ["public"] },
        latency_mode: "low",
      });

      // Create the stream record with LIVE status and Mux details
      const stream = await this.streamModel.create({
        ...input,
        imam: "ABDULLAH",
        status: StreamStatus.LIVE, // Set as LIVE immediately for quick start
        scheduledStartTime: new Date(),
        actualStartTime: new Date(),
        chatEnabled: true,
        rtmpUrl: liveStream.rtmp_ingest_url,
        streamKey: liveStream.stream_key,
        playbackId: liveStream.playback_ids?.[0]?.id,
        muxStreamId: liveStream.id,
      });

      return stream;
    } catch (err) {
      console.error("Error quickStartStream:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default StreamService;
