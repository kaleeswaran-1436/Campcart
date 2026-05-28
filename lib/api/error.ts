import type { ApiErrorCode, ApiErrorBody } from "@/types/api";

/* ═══════════════════════════════════════════════════════════════
   CampCart — Centralized API Error System
   ═══════════════════════════════════════════════════════════════ */

/**
 * Typed API error thrown by the fetch client.
 * Carries HTTP status, error code, and optional field (for validation).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly field?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    status: number,
    code: ApiErrorCode = "UNKNOWN",
    field?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.field = field;
    this.details = details;
  }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden()    { return this.status === 403; }
  get isNotFound()     { return this.status === 404; }
  get isValidation()   { return this.status === 422 || this.code === "VALIDATION_ERROR"; }
  get isRateLimit()    { return this.status === 429; }
  get isServer()       { return this.status >= 500; }
  get isNetwork()      { return this.code === "NETWORK_ERROR"; }
  get isTimeout()      { return this.code === "TIMEOUT"; }

  /** Human-readable message suitable for showing in UI toast */
  get userMessage(): string {
    const messages: Record<ApiErrorCode, string> = {
      UNAUTHORIZED:     "Please sign in to continue.",
      FORBIDDEN:        "You don't have permission to do that.",
      NOT_FOUND:        "That resource no longer exists.",
      VALIDATION_ERROR: this.message,
      RATE_LIMIT:       "Too many requests. Please wait a moment.",
      SERVER_ERROR:     "Something went wrong on our end. Please try again.",
      NETWORK_ERROR:    "No internet connection. Check your network.",
      TIMEOUT:          "The request timed out. Please try again.",
      UNKNOWN:          "An unexpected error occurred.",
    };
    return messages[this.code] ?? this.message;
  }

  static fromResponse(status: number, body: ApiErrorBody): ApiError {
    return new ApiError(body.message, status, body.code, body.field, body.details);
  }

  static network(cause?: unknown): ApiError {
    const err = new ApiError("Network error", 0, "NETWORK_ERROR");
    if (cause instanceof Error) err.cause = cause;
    return err;
  }

  static timeout(): ApiError {
    return new ApiError("Request timed out", 408, "TIMEOUT");
  }
}

/** Type guard */
export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

/** Extract a display message from any thrown value */
export function getErrorMessage(err: unknown): string {
  if (isApiError(err)) return err.userMessage;
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred.";
}
