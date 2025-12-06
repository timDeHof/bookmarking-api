import type { Level } from "pino"; // Import Pino Level type

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, ZodError } from "zod";

// Load .env file
expand(config());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000), // z.coerce.number() converts string to number
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "fatal"]).default("info") as z.ZodType<Level>, // Cast to Pino Level
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  // Add other environment variables here
}).superRefine((input, ctx) => {
  if (input.NODE_ENV === "production" && !input.DATABASE_AUTH_TOKEN) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: "string",
      received: "undefined",
      path: ["DATABASE_AUTH_TOKEN"],
      message: "Must be set when NODE_ENV is production",
    });
  }
});

type Env = z.infer<typeof envSchema>;

// eslint-disable-next-line import/no-mutable-exports
let env: Env;

try {
  // eslint-disable-next-line node/no-process-env
  env = envSchema.parse(process.env);
}
catch (e) {
  if (e instanceof ZodError) {
    console.error("❌ Invalid environment variables:", e.flatten().fieldErrors);

    process.exit(1);
  }
  throw e;
}

export { env };
