import { NextRequest, NextResponse } from "next/server";
import { aiErrorResponse } from "@/lib/api-error";
import { generateContent } from "@/lib/generate-content";
import { researchPulsePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();

    if (!company) {
      return NextResponse.json(
        { error: "company is required." },
        { status: 400 }
      );
    }

    const text = await generateContent(researchPulsePrompt(company));

    return NextResponse.json({ text });
  } catch (error) {
    return aiErrorResponse(error);
  }
}