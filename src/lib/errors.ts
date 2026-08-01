// Typed app error helpers for consistent surfaces in UI and server fns.

export class AppError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function isAppError(e: unknown): e is AppError {
  return e instanceof AppError;
}

export function toUserMessage(e: unknown): string {
  if (isAppError(e)) return e.message;
  if (e instanceof Error) {
    if (e.message.includes("429")) return "Rate limited. Please try again in a moment.";
    if (e.message.includes("402")) return "AI credits exhausted. Please add credits to continue.";
    return e.message;
  }
  return "Something went wrong. Please try again.";
}
