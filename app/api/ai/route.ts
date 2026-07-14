import { NextRequest, NextResponse } from "next/server";
import { aiErrorResponse } from "@/lib/api-error";
import { generateContent } from "@/lib/generate-content";
import { getPrompt } from "@/lib/prompts/router";

export async function POST(req: NextRequest) {
  try {
    const { company, question } = await req.json();

    if (!company || !question) {
      return NextResponse.json(
        { error: "company and question are required." },
        { status: 400 }
      );
    }

    const prompt = getPrompt(company, question);
    const text = await generateContent(prompt);

    return NextResponse.json({ text });
  } catch (error) {
    return aiErrorResponse(error);
  }
}