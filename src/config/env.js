import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGO_URI: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("15m"),
  CORS_ORIGIN: z.string().default("*"),
  LOG_FORMAT: z.string().default("dev"),
  BODY_LIMIT: z.string().default("1mb"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  SWAGGER_ENABLED: z
    .string()
    .optional()
    .default("true")
    .transform((v) => v === "true")
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  process.stderr.write(parsed.error.toString() + "\n");
  process.exit(1);
}

const env = parsed.data;

export const config = {
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
  MONGO_URI: env.MONGO_URI,
  JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,
  CORS_ORIGIN: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((s) => s.trim()),
  LOG_FORMAT: env.LOG_FORMAT,
  BODY_LIMIT: env.BODY_LIMIT,
  RATE_LIMIT_WINDOW_MS: env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: env.RATE_LIMIT_MAX,
  SWAGGER_ENABLED: env.SWAGGER_ENABLED
};
