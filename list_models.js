import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");

let apiKey = "";

try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
        if (match && match[1]) {
            apiKey = match[1].trim();
        }
    }
} catch (e) {
    console.error("Could not read .env file");
}

if (!apiKey) {
    console.error("No API key found in .env");
    process.exit(1);
}


async function listModels() {
    try {
        console.log(`Checking models for API key: ${apiKey.substring(0, 10)}...`);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("Error listing models:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("\nAvailable Models:");
            if (data.models) {
                data.models.forEach(m => {
                  
                    console.log(`- ${m.name}`);
                });
            } else {
                console.log("No models returned.");
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
