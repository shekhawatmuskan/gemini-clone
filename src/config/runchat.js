import { GoogleGenerativeAI } from "@google/generative-ai";

function getApiKeys() {
  const raw = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!raw) return [];
  return raw
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
}

function getModels() {
  const raw = import.meta.env.VITE_GEMINI_MODEL || "";
  if (raw) {
    return raw
      .split(",")
      .map((model) => model.trim())
      .filter((model) => model.length > 0);
  }
  return [
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash",
  ];
}

const responseCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; 

const exhaustedCombinations = new Set();

function getCacheKey(prompt) {
  return prompt.toLowerCase().trim();
}

function getCachedResponse(prompt) {
  const key = getCacheKey(prompt);
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.response;
  }
  return null;
}

function setCachedResponse(prompt, response) {
  const key = getCacheKey(prompt);
  responseCache.set(key, {
    response,
    timestamp: Date.now(),
  });
}

function getCombinationKey(apiKey, model) {
  return `${apiKey.substring(0, 10)}_${model}`;
}

async function runchat(prompt) {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    throw new Error(
      "Missing Gemini API key. Make sure .env contains VITE_GEMINI_API_KEY and restart the dev server.",
    );
  }

  const textPrompt = prompt?.trim();
  if (!textPrompt) return "";

  const cachedResponse = getCachedResponse(textPrompt);
  if (cachedResponse) {
    console.log("✅ Using cached response");
    return cachedResponse;
  }

  const models = getModels();
  const finalPrompt = `
You are a helpful and concise AI assistant.

Your goal is to provide answers that are **easy to read and understand**.

Formatting Rules:
1. **Use Bullet Points**: Break down information into clean bulleted lists.
2. **Avoid Large Headers**: Do NOT use markdown headers like #, ##, or ###. Use **bold text** for emphasis instead.
3. **Keep it Simple**: Use simple language and short paragraphs.
4. **Code Blocks**: If explaining code, wrap it in code blocks.

Example Style:
- **Concept**: Explanation
- **Usage**: Explanation
- **Key Benefit**: Explanation

User Question:
${textPrompt}
`;

  const errors = [];

  for (const apiKey of apiKeys) {
    for (const modelName of models) {
      const combinationKey = getCombinationKey(apiKey, modelName);

      if (exhaustedCombinations.has(combinationKey)) {
        continue;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1200,
          },
        });

        console.log(`🔄 Trying API key (${apiKey.substring(0, 10)}...) with model: ${modelName}`);
        const result = await model.generateContent(finalPrompt);
        const responseText = result.response.text();

        setCachedResponse(textPrompt, responseText);
        console.log(`✅ Success with ${modelName}`);

        return responseText;
      } catch (error) {
        const errorMessage = error?.message || "";

        if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("Quota exceeded")) {
          console.warn(`⚠️ Quota exceeded for ${modelName} with API key (${apiKey.substring(0, 10)}...)`);
          exhaustedCombinations.add(combinationKey);
          errors.push({ apiKey, modelName, error });
          continue; 
        }

       
        console.error(`❌ Error with ${modelName}:`, errorMessage);
        errors.push({ apiKey, modelName, error });
      }
    }
  }

  console.error("❌ All API key/model combinations exhausted or failed");

  const allQuotaErrors = errors.every((e) => {
    const msg = e.error?.message || "";
    return msg.includes("429") || msg.includes("quota") || msg.includes("Quota exceeded");
  });

  if (allQuotaErrors) {
    const quotaError = new Error(
      "All API quotas exceeded. Please wait for quota reset, add more API keys/models, or upgrade your billing plan."
    );
    quotaError.name = "QuotaExceededError";
    throw quotaError;
  }

 
  const lastError = errors[errors.length - 1]?.error;
  throw new Error(lastError?.message || "All API attempts failed");
}

export default runchat;
