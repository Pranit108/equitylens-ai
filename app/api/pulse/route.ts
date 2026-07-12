import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { researchPulsePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {

    try {
        const {company} = await req.json();

        const prompt = researchPulsePrompt(company);

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
        {error : "Something went wrong"},
        {status: 500}
    );
    }
}