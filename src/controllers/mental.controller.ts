import { Request, Response } from "express";
import Errors from "../libs/Error";
import { classifyMentalStage } from "../ai-api/openaiClient";
import { storeHashToBlockchain } from "../blockchain/storeHashToBlockchain";
import { saveSession } from "../schema/chatgptModel";

const mentalController: any = {};

// mentalController.analyze = async (req: Request, res: Response) => {
//   try {
//     const { userId, text } = req.body;
//     console.log("REQUEST BODY", req.body);

//     if (!userId || !text) {
//       res.status(400).json({
//         success: false,
//         message: "userId and text are required",
//       });
//       return;
//     }

//     const result = await classifyMentalStage(text);
//     const session = await saveSession({ userId, text, result });
//     // const blockchainHash = await storeHashToBlockchain(session._id.toString());

//     res.status(200).json({
//       success: true,
//       result,
//       sessionId: session._id.toString(),
//       // blockchainHash,
//     });
//   } catch (err) {
//     console.error("Error, chatgpt:", err);
//     if (err instanceof Errors) {
//       res.status(err.code).json();
//     }
//   }
// };
mentalController.analyze = async (req: Request, res: Response) => {
  try {
    const { userId, text, sessionId } = req.body;

    if (!userId || !text) {
      res.status(400).json({
        success: false,
        message: "userId and text are required",
      });
      return;
    }

    const result = await classifyMentalStage(text, sessionId);

    let session;
    if (sessionId) {
      // Update existing session
      session = await saveSession({
        _id: sessionId,
        role: "assistant",
        content: result,
        result,
      });
    } else {
      // Create new session
      session = await saveSession({ userId, text, result });
    }

    res.status(200).json({
      success: true,
      result,
      sessionId: session._id.toString(),
    });
  } catch (err) {
    console.error("Error in mental analysis:", err);
    if (err instanceof Errors) {
      res.status(err.code).json();
    }
  }
};

export default mentalController;
