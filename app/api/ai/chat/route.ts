// import { NextRequest, NextResponse } from "next/server";
// import { openrouter } from "@/lib/openrouter";
// import { getPrompt } from "@/lib/prompts/router";

// export async function POST(req: NextRequest) {
//   try {
//     const { company, question } = await req.json();

//     const prompt = getPrompt(company, question);

//     const completion = await openrouter.chat.completions.create({
//       model: "qwen/qwen3-32b",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });

//     return NextResponse.json({
//       text: completion.choices[0].message.content,
//     });

//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         error: "Failed to generate response.",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }¸

import { NextRequest } from "next/server";
import { openrouter } from "@/lib/openrouter";
import { getPrompt } from "@/lib/prompts/router";

export async function POST(req: NextRequest) {
  try {
    const { company, question } = await req.json();

    const prompt = getPrompt(company, question);

    const stream = await openrouter.chat.completions.create({
      model: "qwen/qwen3-32b",
      stream: true,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;

            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response("Failed to generate response.", {
      status: 500,
    });
  }
}