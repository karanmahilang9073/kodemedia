import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

export const rewritePost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "user",
          content: `Rewrite this social media post clearly and engagingly without changing its meaning:\n\n${content}`
        }
      ],
      max_tokens: 150,
    });

    return res.status(200).json({
      rewrittenContent: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("HF ERROR:", error);
    return res.status(500).json({
      message: "AI rewrite failed",
      error: error.message,
    });
  }
};
