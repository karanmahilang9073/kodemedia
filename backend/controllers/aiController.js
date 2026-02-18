import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const rewritePost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const prompt = `Rewrite the following social media post in a clear and engaging way without changing its meaning:\n\n${content}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",  // ✅ Correct working model
      contents: prompt,
    });

    return res.status(200).json({
      rewrittenContent: response.text,
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      message: "AI rewrite failed",
      error: error.message,
    });
  }
};
