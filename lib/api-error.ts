import { NextResponse } from "next/server";
import { GeminiQuotaError } from "@/lib/generate-content";

export function aiErrorResponse(error: unknown) {
  console.error(error);

  if (error instanceof GeminiQuotaError) {
    return NextResponse.json(
      {
        error: error.message,
        code: "QUOTA_EXCEEDED",
        retryAfterSeconds: error.retryAfterSeconds,
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { error: "Something went wrong." },
    { status: 500 }
  );
}
