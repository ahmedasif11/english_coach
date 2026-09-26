import type { Health, SessionStart, TurnResponse } from "./types";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function health(): Promise<Health> {
  const response = await fetch("/api/health");
  return readJson<Health>(response);
}

export async function startSession(): Promise<SessionStart> {
  const response = await fetch("/api/sessions", { method: "POST" });
  return readJson<SessionStart>(response);
}

export async function sendTurn(sessionId: string, wav: Blob): Promise<TurnResponse> {
  const response = await fetch(`/api/sessions/${sessionId}/turns`, {
    method: "POST",
    headers: { "Content-Type": "audio/wav" },
    body: wav,
  });
  return readJson<TurnResponse>(response);
}

export async function endSession(sessionId: string): Promise<void> {
  const response = await fetch(`/api/sessions/${sessionId}/end`, { method: "POST" });
  if (!response.ok) await throwApiError(response);
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) await throwApiError(response);
  return (await response.json()) as T;
}

async function throwApiError(response: Response): Promise<never> {
  let message = "Transcription failed. Try that sentence again.";
  try {
    const body: unknown = await response.json();
    if (
      body &&
      typeof body === "object" &&
      "detail" in body &&
      typeof body.detail === "string"
    ) {
      message = body.detail;
    }
  } catch {
    /* keep the fallback */
  }
  throw new ApiError(response.status, message);
}
