import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCwyPymUs52864pHoydth3tHWdluvBpVlY";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function runchat(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt); // Use the variable 'prompt'
  return result.response.text(); // Ensure to use the correct method to retrieve the text
}

export default runchat;
