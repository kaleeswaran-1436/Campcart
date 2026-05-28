import { ApiError } from "./error";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Unwrap a standard { data, success, message } API envelope.
 * Throws ApiError if success is false.
 */
export function unwrapResponse<T>(envelope: ApiResponse<T>): T {
  if (!envelope.success) {
    throw new ApiError(
      envelope.message ?? "Request failed",
      400,
      "UNKNOWN"
    );
  }
  return envelope.data;
}

/**
 * Unwrap a paginated response envelope.
 */
export function unwrapPaginated<T>(
  envelope: PaginatedResponse<T>
): { items: T[]; total: number; hasNextPage: boolean; hasPrevPage: boolean } {
  return {
    items: envelope.data,
    total: envelope.total,
    hasNextPage: envelope.hasNextPage,
    hasPrevPage: envelope.hasPrevPage,
  };
}

/**
 * Safe async runner — returns [data, null] | [null, ApiError]
 * Eliminates try/catch noise in components.
 *
 * @example
 * const [listing, err] = await safeAsync(() => listingsApi.getById(id));
 * if (err) return <ErrorState error={err} />;
 */
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, ApiError]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (err) {
    if (err instanceof ApiError) return [null, err];
    return [null, ApiError.network(err)];
  }
}
