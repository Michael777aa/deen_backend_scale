import mongoose from "mongoose";

// Update your schema/sessionModel.ts
const sessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    messages: [
      {
        role: {
          type: String,
          enum: ["system", "user", "assistant"],
          required: true,
        },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    result: { type: String },
    blockchainHash: { type: String },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);

// Save session to database
export const saveSession = async (sessionData: any) => {
  // For new sessions
  if (!sessionData._id) {
    const session = new Session({
      userId: sessionData.userId,
      messages: [
        {
          role: "system",
          content: `You are an AI assistant within an Islamic app`,
        },
        {
          role: "user",
          content: sessionData.text,
        },
      ],
      result: sessionData.result,
      blockchainHash: sessionData.blockchainHash, // <-- Add this
    });
    return await session.save();
  } else {
    // For existing sessions
    return await Session.findByIdAndUpdate(
      sessionData._id,
      {
        $push: {
          messages: {
            role: sessionData.role,
            content: sessionData.content,
          },
        },
        result: sessionData.result,
        blockchainHash: sessionData.blockchainHash, // <-- Add this
      },
      { new: true }
    );
  }
};
