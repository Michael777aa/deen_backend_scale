import { Session } from "../schema/chatgptModel";
import { classifyMentalStage } from "../ai-api/openaiClient";
import { storeHashToBlockchain } from "../blockchain/storeHashToBlockchain";

class ChatgptService {
  async analyze(userId: string, text: string, sessionId?: string) {
    const result = await classifyMentalStage(text, sessionId);
    let session;

    if (sessionId) {
      session = await Session.findByIdAndUpdate(
        sessionId,
        {
          $push: {
            messages: {
              role: "assistant",
              content: result,
            },
          },
        },
        { new: true }
      );
    } else {
      session = new Session({
        userId,
        messages: [
          {
            role: "system",
            content: "You are an AI assistant within an Islamic app.",
          },
          {
            role: "user",
            content: text,
          },
          {
            role: "assistant",
            content: result,
          },
        ],
      });
      await session.save();
    }

    const blockchainHash = await storeHashToBlockchain(session._id.toString());

    session.blockchainHash = blockchainHash;
    await session.save();

    return {
      result,
      sessionId: session._id.toString(),
      blockchainHash,
    };
  }
}

export default ChatgptService;
