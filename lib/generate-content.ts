import { ai } from "@/lib/gemini";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

const inflight = new Map<string, Promise<string>>();

export class GeminiQuotaError extends Error {
  retryAfterSeconds?: number;

  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "GeminiQuotaError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function parseRetryAfterSeconds(error: unknown): number | undefined {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  const match = message.match(/retry in ([0-9.]+)s/i);
  return match ? Math.ceil(Number(match[1])) : undefined;
}

function isQuotaError(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: number }).status === 429
  ) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return message.includes("429") || message.includes("RESOURCE_EXHAUSTED");
}

async function callGemini(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  return response.text;
}

export async function generateContent(prompt: string): Promise<string> {
  const cacheKey = `${MODEL}:${prompt}`;

  const existing = inflight.get(cacheKey);
  if (existing) {
    return existing;
  }

  const request = (async () => {
    try {
      return await callGemini(prompt);
    } catch (error) {
      if (isQuotaError(error)) {
        throw new GeminiQuotaError(
          "Gemini API quota exceeded. Free tier limits apply per model — try again later or enable billing.",
          parseRetryAfterSeconds(error)
        );
      }

      throw error;
    } finally {
      inflight.delete(cacheKey);
    }
  })();

  inflight.set(cacheKey, request);
  return request;
}
