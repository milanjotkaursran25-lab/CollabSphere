
const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const generateAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a prompt"
      });
    }

    if (prompt.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Prompt must be 10,000 characters or fewer"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt.trim());
    const response = result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      response: text
    });
  } catch (error) {
    console.error("Gemini API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response"
    });
  }
};

module.exports = {
  generateAIResponse
};
