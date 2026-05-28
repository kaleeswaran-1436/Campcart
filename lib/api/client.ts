import { ApiError } from "./error";
import type { ApiErrorBody } from "@/types/api";

/* ═══════════════════════════════════════════════════════════════
   CampCart — Enhanced Fetch Client
   Supports: auth headers, retry, timeout, error normalization
   ═══════════════════════════════════════════════════════════════ */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_RETRY_COUNT = 2;
const RETRY_DELAY_MS = 800;

/* ── Retry-able status codes ────────────────────────────────── */
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Bearer token — injected automatically if provided */
  token?: string;
  /** Next.js fetch cache tags */
  tags?: string[];
  /** Next.js ISR revalidation (seconds) */
  revalidate?: number | false;
  /** Override timeout (ms) */
  timeout?: number;
  /** Override retry count */
  retries?: number;
}

/* ── Sleep helper ───────────────────────────────────────────── */
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/* ── Core request function ──────────────────────────────────── */
export async function apiRequest<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    token,
    tags,
    revalidate,
    timeout = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRY_COUNT,
  } = config;

  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const builtHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions: RequestInit & { next?: Record<string, unknown> } = {
    method,
    headers: builtHeaders,
    signal: controller.signal,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  };

  let attempt = 0;

  while (true) {
    try {
      const res = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      if (res.ok) {
        // 204 No Content
        if (res.status === 204) return undefined as unknown as T;
        return (await res.json()) as T;
      }

      // Try to parse error body
      let errBody: ApiErrorBody | null = null;
      try { errBody = (await res.json()) as ApiErrorBody; } catch { /* empty */ }

      const apiErr = errBody
        ? ApiError.fromResponse(res.status, errBody)
        : new ApiError(res.statusText || "Request failed", res.status);

      // Retry on retryable codes
      if (RETRYABLE_STATUSES.has(res.status) && attempt < retries) {
        attempt++;
        const backoff = RETRY_DELAY_MS * attempt;
        await sleep(backoff);
        continue;
      }

      throw apiErr;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) throw err;

      // Abort = timeout
      if (err instanceof Error && err.name === "AbortError") {
        throw ApiError.timeout();
      }

      // Network errors — retry
      if (attempt < retries) {
        attempt++;
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      throw ApiError.network(err);
    }
  }
}

/* ── Convenience wrappers ───────────────────────────────────── */
export const api = {
  get: <T>(path: string, config?: Omit<RequestConfig, "method" | "body">) =>
    apiRequest<T>(path, { ...config, method: "GET" }),

  post: <T>(path: string, body: unknown, config?: Omit<RequestConfig, "method" | "body">) =>
    apiRequest<T>(path, { ...config, method: "POST", body }),

  put: <T>(path: string, body: unknown, config?: Omit<RequestConfig, "method" | "body">) =>
    apiRequest<T>(path, { ...config, method: "PUT", body }),

  patch: <T>(path: string, body: unknown, config?: Omit<RequestConfig, "method" | "body">) =>
    apiRequest<T>(path, { ...config, method: "PATCH", body }),

  delete: <T>(path: string, config?: Omit<RequestConfig, "method" | "body">) =>
    apiRequest<T>(path, { ...config, method: "DELETE" }),
};
