import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../../../../libs/Error";
import ChatgptService from "../../domain/chatgpt.service";
import { transcribeWhisper } from "../../ai-apis/transcribeWhisper";
import logger from "../../../../libs/utils/logger";
import { AuthRequest } from "../../../../libs/middleware/authMiddleware";

const chatgptController: any = {};
const chatgptService = new ChatgptService();

chatgptController.analyze = async (req: AuthRequest, res: Response) => {
  try {
    const { text, sessionId } = req.body;
    if (!text) throw new Errors(HttpCode.NOT_FOUND, Message.CHATGPT_TEXT_ERROR);
    const userId = req?.user?.id;

    const result = await chatgptService.analyze(userId, text, sessionId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    logger.error("Error in mental analysis:", err);
    res.status(500).json({
      success: false,
      message: "Error in mental analysis",
    });
  }
};
chatgptController.analyzeVoice = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.body;
    if (!req.file) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    const userId = req?.user?.id;

    const text = await transcribeWhisper(req.file.path); // Whisper runs locally
    const result = await chatgptService.analyze(userId, text, sessionId);
    return res.status(200).json(result);
  } catch (err: any) {
    logger.error("Voice error:", err);
    res.status(500).json({
      success: false,
      message: "Error on Voice Processing",
    });
  }
};

export default chatgptController;
