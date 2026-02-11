import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

function getApiKey() {
  const raw = import.meta.env.VITE_GEMINI_API_KEY;
  if (!raw) return "";
  return String(raw).trim();
}

async function runchat(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Make sure .env contains VITE_GEMINI_API_KEY and restart the dev server.",
    );
  }

  const textPrompt = prompt?.trim();
  if (!textPrompt) return "";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1200,
      },
    });

    const finalPrompt = `
You are a smart, practical AI assistant.

Follow these behavioral rules strictly:

1. If the user sends a greeting (like "hi", "hello", "hey"):
   → Respond in ONE short friendly sentence only.

2. If the user asks for a list (to-do list, steps, points, plan):
   → Give a clean bullet list.
   → No long introductions.
   → No unnecessary explanations.

3. If the user asks a technical or conceptual question:
   → Give a structured explanation.
   → Be clear and useful.
   → Avoid motivational speeches or long generic intros.

4. Always match the length of the response to the complexity of the question.
   → Simple question = short answer.
   → Detailed question = detailed answer.

User message:
${textPrompt}
`;

    const result = await model.generateContent(finalPrompt);

    return result.response.text();
  } catch (error) {
    console.error("Error in runchat:", error);
    throw new Error(error?.message || "Gemini API error");
  }
}

export default runchat;
