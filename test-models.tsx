import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });



console.log(process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function main() {
  const models = await ai.models.list();

  for await (const model of models) {
    console.log(model.name);
  }
}

main();