const Groq = require("groq-sdk");
const { buildSystemPrompt } = require("./prompt");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateAnswer(question, trip, conversation = [], yatraContext = null) {
  const messages = [
    {
      role: "system",
      content: buildSystemPrompt(trip, yatraContext)
    },
    ...conversation,
    {
      role: "user",
      content: question
    }
  ];

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages
  });

  const answer = response.choices[0].message.content;

  let source = "general";

  if (yatraContext) {
    source = "verified";
  } else if (trip) {
    source = "trip";
  }

  return {
    answer,
    source
  };
}

module.exports = {
  generateAnswer
};