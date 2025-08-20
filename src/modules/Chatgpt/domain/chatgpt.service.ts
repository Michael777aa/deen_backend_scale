import { classifyMentalStage } from "../ai-apis/deepSeek";
import { searchIslamicTopic } from "../ai-apis/searchIslamicInfo";
import { storeHashToBlockchain } from "../blockchain/storeHashToBlockchain";
import { Session } from "../data-access/db";

export default class ChatgptService {
  async analyze(userId: string, text: string, sessionId?: string) {
    const links = await searchIslamicTopic(text);

    const result = await classifyMentalStage(text, sessionId);

    const formattedResponse = `${result}\n\n🔗 Related Islamic links:\n${links.join(
      "\n"
    )}`;

    const session = sessionId
      ? await Session.findByIdAndUpdate(
          sessionId,
          {
            $push: {
              messages: { role: "assistant", content: formattedResponse },
            },
          },
          { new: true }
        )
      : await new Session({
          userId,
          messages: [
            {
              role: "system",
              content: "You are an AI assistant within an Islamic app.",
            },
            { role: "user", content: text },
            { role: "assistant", content: formattedResponse },
          ],
        }).save();

    const blockchainHash = await storeHashToBlockchain(session._id.toString());
    session.blockchainHash = blockchainHash;
    await session.save();

    return {
      result,
      sessionId: session._id.toString(),
    };
  }
}
