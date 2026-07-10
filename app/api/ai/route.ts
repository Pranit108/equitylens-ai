import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    });

    return NextResponse.json({
      text: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}