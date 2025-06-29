import { Request, Response } from "express";
import Errors, { HttpCode } from "../libs/Error";
import { T } from "../libs/types/common";
import { StreamInput, StreamUpdateInput } from "../libs/types/stream";
import StreamService from "../services/stream.service";
import { StreamType } from "../libs/enums/stream.enum";

/**********************   
       STREAMS 
**********************/

const streamService = new StreamService();
const streamController: T = {};

streamController.createNewStream = async (req: Request, res: Response) => {
  try {
    const input: StreamInput = req.body;
    const result = await streamService.createNewStream(input);
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error createNewStream:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.getLiveStreams = async (req: Request, res: Response) => {
  try {
    const data = await streamService.getLiveStreams();
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getLiveStreams:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.getAllStreams = async (req: Request, res: Response) => {
  try {
    const data = await streamService.getAllStreams();
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getAllStreams:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};
streamController.startStream = async (req: Request, res: Response) => {
  try {
    const result = await streamService.startStream(req.params.id);
    console.log("RESULT", result);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error starting stream:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.endStream = async (req: Request, res: Response) => {
  try {
    const result = await streamService.endStream(req.params.id);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error ending stream:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.getStreamById = async (req: Request, res: Response) => {
  try {
    const data = await streamService.getStreamById(req.params.id);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getStreamById:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.updateChosenStream = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const input: StreamUpdateInput = req.body;
    const result = await streamService.updateChosenStream(id, input);
    res
      .status(HttpCode.OK)
      .json({ message: "Successfully updated", data: result });
  } catch (err) {
    console.error("Error updateChosenStream:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.deleteChosenStream = async (req: Request, res: Response) => {
  try {
    const result = await streamService.deleteChosenStream(req.params.id);
    res
      .status(HttpCode.OK)
      .json({ message: "Successfully deleted", data: result });
  } catch (err) {
    console.error("Error deleteChosenStream:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};
// Add these new controller methods
streamController.getUpcomingStreams = async (req: Request, res: Response) => {
  try {
    const data = await streamService.getUpcomingStreams();
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getUpcomingStreams:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.getRecordedStreams = async (req: Request, res: Response) => {
  try {
    const data = await streamService.getRecordedStreams();
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getRecordedStreams:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.getStreamsByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const data = await streamService.getStreamsByType(type as StreamType);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getStreamsByType:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.likeStream = async (req: Request, res: Response) => {
  try {
    const result = await streamService.likeStream(req.params.id);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error likeStream:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

streamController.addComment = async (req: Request, res: Response) => {
  try {
    const { userId, text } = req.body;
    const result = await streamService.addComment(req.params.id, userId, text);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error addComment:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};
streamController.quickStart = async (req: Request, res: Response) => {
  try {
    const input: StreamInput = req.body;
    const result = await streamService.quickStartStream(
      // "req.member._id",
      input
    );
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error quickStart:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default streamController;
