import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const rewritePost = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "content is required" });
        }

        // Using gemini-1.5-flash which is standard and fast
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `Rewrite the following social media post in a clear and engaging way without changing its meaning:\n\n${content}`;

        const result = await model.generateContent(prompt);
        
        // Use await here to ensure text is extracted properly
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            rewrittenContent: text
        });
    } catch (error) {
        console.error("Gemini Error:", error); // Log the actual error for debugging
        res.status(500).json({ 
            message: "AI rewrite failed",
            error: error.message // Helps you see why it failed during testing
        });
    }
};