import type {
  ApiResponse,
  PaginatedResponse,
  Listing,
  ListingFilters,
  SortOption,
} from "@/types";

/* ── Base client ──────────────────────────────────────────── */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  tags?: string[];           // for Next.js fetch caching
  revalidate?: number | false;
}

async function request<T>(
  path: string,
  { method = "GET", body, headers = {}, tags, revalidate }: RequestOptions = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      (error as { message?: string }).message ?? "API request failed"
    );
  }

  return res.json() as Promise<T>;
}

/* ── Listings API ─────────────────────────────────────────── */
export const listingsApi = {
  getAll: (
    filters?: ListingFilters,
    sort?: SortOption,
    page = 1,
    pageSize = 20
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(sort ? { sort } : {}),
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.condition ? { condition: filters.condition } : {}),
      ...(filters?.query ? { q: filters.query } : {}),
      ...(filters?.minPrice !== undefined ? { minPrice: String(filters.minPrice) } : {}),
      ...(filters?.maxPrice !== undefined ? { maxPrice: String(filters.maxPrice) } : {}),
    });
    return request<PaginatedResponse<Listing>>(`/listings?${params}`, {
      tags: ["listings"],
      revalidate: 60,
    });
  },

  getById: (id: string) =>
    request<ApiResponse<Listing>>(`/listings/${id}`, {
      tags: [`listing-${id}`],
      revalidate: 30,
    }),

  create: (data: Partial<Listing>, token: string) =>
    request<ApiResponse<Listing>>("/listings", {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    }),

  update: (id: string, data: Partial<Listing>, token: string) =>
    request<ApiResponse<Listing>>(`/listings/${id}`, {
      method: "PATCH",
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    }),

  delete: (id: string, token: string) =>
    request<ApiResponse<null>>(`/listings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

/* ── Auth API ─────────────────────────────────────────────── */
export const authApi = {
  login: (email: string, password: string) =>
    request<ApiResponse<{ token: string }>>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (data: {
    name: string;
    email: string;
    password: string;
    college: string;
    rollNumber: string;
  }) =>
    request<ApiResponse<{ token: string }>>("/auth/register", {
      method: "POST",
      body: data,
    }),

  verifyStudentId: (formData: FormData, token: string) =>
    fetch(`${BASE_URL}/auth/verify-id`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then((r) => r.json() as Promise<ApiResponse<{ status: string }>>),
};
