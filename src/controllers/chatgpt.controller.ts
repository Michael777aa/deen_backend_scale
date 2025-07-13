import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import ChatgptService from "../services/chatgpt.service";
import { transcribeWhisper } from "../libs/transcribeWhisper";
const chatgptController: any = {};
const chatgptService = new ChatgptService();

chatgptController.analyze = async (req: Request, res: Response) => {
  try {
    const { userId, text, sessionId } = req.body;

    if (!userId || !text)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    const result = await chatgptService.analyze(userId, text, sessionId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("Error in mental analysis:", err);
    if (err instanceof Errors) {
      return res
        .status(err.code)
        .json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
chatgptController.analyzeVoice = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId } = req.body;
    if (!req.file) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    const text = await transcribeWhisper(req.file.path); // Whisper runs locally
    const result = await chatgptService.analyze(userId, text, sessionId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Voice error:", err);
    return res.status(500).json({ message: "Voice processing failed" });
  }
};

export default chatgptController;
