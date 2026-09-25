require("dotenv").config();

const express = require("express");
const { generateAnswer } = require("./ai");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "YatraSetu AI API is running"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const {
  question,
  trip = null,
  conversation = [],
  yatraContext = null
} = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    if (!Array.isArray(conversation)) {
      return res.status(400).json({
        error: "Conversation must be an array"
      });
    }

    const result = await generateAnswer(
  question,
  trip,
  conversation,
  yatraContext
);

res.json(result);

  } catch (error) {
    console.log("AI request failed:", error.message);

    res.status(500).json({
      error: "Failed to generate AI response"
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
});