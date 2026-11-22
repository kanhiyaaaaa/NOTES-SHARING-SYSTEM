const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();
const ai = new GoogleGenAI();

// Multi-model fallback chain (ek busy ho toh turant agla chalega)
const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let response;
    let lastError;

    for (const modelName of MODELS) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: message,
          config: {
            systemInstruction:
              "You are a helpful study assistant for a notes-sharing platform. Help students understand concepts, summarize notes, and answer doubts clearly.",
          },
        });
        console.log(`Success with model: ${modelName}`);
        break;
      } catch (err) {
        lastError = err;
        if (err.status === 503 || err.status === 429 || err.status === 404) {
          console.log(`${modelName} fail hua (${err.status}), agla model try kar rahe hain...`);
          continue;
        }
        throw err;
      }
    }

    if (!response) {
      throw lastError;
    }

    res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(error.status || 500).json({
      error: "AI abhi thoda busy hai, kuch seconds baad dubara try karein.",
      details: error.message,
    });
  }
});

module.exports = router;