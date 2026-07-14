type AiResponse = {
  text?: string;
  error?: string;
  code?: string;
  retryAfterSeconds?: number;
};

export async function postAi(
  url: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: AiResponse }> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as AiResponse;
  return { ok: res.ok, status: res.status, data };
}

export function formatAiError(data: AiResponse): string {
  if (data.code === "QUOTA_EXCEEDED") {
    const retry = data.retryAfterSeconds
      ? ` Retry in about ${data.retryAfterSeconds}s, or wait until tomorrow's quota resets.`
      : " Wait until your daily quota resets, or enable billing in Google AI Studio.";
    return data.error ?? `Gemini API quota exceeded.${retry}`;
  }

  return data.error ?? "Something went wrong while generating the research.";
}
