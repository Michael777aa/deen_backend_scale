import axios from "axios";
import { Session } from "../data-access/db";

// Define the only task for the model: classification
export const classifyMentalStage = async (
  text: string,
  sessionId?: string
): Promise<string> => {
  try {
    // Initial prompt for classification only — NO advice or suggestions
    let messages = [
      {
        role: "system",
        content: `You are an AI assistant within an Islamic app.
`,
      },
      {
        role: "user",
        content: text,
      },
    ];

    // Optional: include past messages for continuity (if you need multi-turn context)
    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (session) {
        messages = session.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }));
        messages.push({ role: "user", content: text });
      }
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        messages,
        max_tokens: 21000, // Only one label is needed
        temperature: 0, // deterministic for classification
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://c59c89ba29e7.ngrok-free.app",
          "X-Title": "islamic-mental-health-app",
        },
        timeout: 30000,
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error(
      "OpenRouter API error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to classify mental state");
  }
};
