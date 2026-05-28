import { z } from "zod";

/* ─────────────────────────────────────────────────────────────
   CampCart — Environment Variable Validation
   Validates all env vars at module load time with Zod.
   Throws a descriptive error during build/start if any are missing.
   ───────────────────────────────────────────────────────────── */

const serverEnvSchema = z.object({
  /* App */
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  /* Database */
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  DIRECT_URL: z.string().optional(),

  /* Supabase */
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase service role key is required").optional(),

  /* Cloudinary */
  CLOUDINARY_API_KEY:    z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  /* AI */
  GEMINI_API_KEY: z.string().optional(),
});

const clientEnvSchema = z.object({
  /* App */
  NEXT_PUBLIC_APP_URL:  z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("CampCart"),

  /* API */
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000/api/v1"),

  /* Supabase */
  NEXT_PUBLIC_SUPABASE_URL:      z.string().url("Valid Supabase URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase Anon Key is required"),

  /* Cloudinary */
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),

  /* Socket */
  NEXT_PUBLIC_SOCKET_URL: z.string().url().default("http://localhost:4000"),
});

function validateEnv() {
  // Server env — only validated on server
  if (typeof window === "undefined") {
    const serverResult = serverEnvSchema.safeParse(process.env);
    if (!serverResult.success) {
      const formatted = serverResult.error.format();
      console.error("❌ Invalid server environment variables:", JSON.stringify(formatted, null, 2));
      // Only throw in production to not break local dev with partial env
      if (process.env["NODE_ENV"] === "production") {
        throw new Error("Invalid server environment variables — check your .env");
      }
    }
  }

  const clientResult = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL:               process.env["NEXT_PUBLIC_APP_URL"],
    NEXT_PUBLIC_APP_NAME:              process.env["NEXT_PUBLIC_APP_NAME"],
    NEXT_PUBLIC_API_URL:               process.env["NEXT_PUBLIC_API_URL"],
    NEXT_PUBLIC_SUPABASE_URL:          process.env["NEXT_PUBLIC_SUPABASE_URL"],
    NEXT_PUBLIC_SUPABASE_ANON_KEY:     process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env["NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"],
    NEXT_PUBLIC_SOCKET_URL:            process.env["NEXT_PUBLIC_SOCKET_URL"],
  });

  if (!clientResult.success) {
    console.warn("⚠️  Some client env vars are missing — using defaults.");
  }

  return {
    server: serverEnvSchema.parse(process.env),
    client: clientResult.data ?? clientEnvSchema.parse({}),
  };
}

export const env = validateEnv();

/* ── Typed accessors ─────────────────────────────────────────── */
export const appConfig = {
  appUrl:         env.client.NEXT_PUBLIC_APP_URL,
  appName:        env.client.NEXT_PUBLIC_APP_NAME,
  apiUrl:         env.client.NEXT_PUBLIC_API_URL,
  socketUrl:      env.client.NEXT_PUBLIC_SOCKET_URL,
  supabaseUrl:    env.client.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnon:   env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  cloudinaryName: env.client.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  isProduction:   env.server.NODE_ENV === "production",
  isDevelopment:  env.server.NODE_ENV === "development",
} as const;
