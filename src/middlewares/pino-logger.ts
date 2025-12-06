import type { Level } from "pino";

import { logger as honoPinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

import { env } from "@/env"; // Import type-safe env

export function pinoLogger() {
  const stream = env.NODE_ENV === "production"
    ? undefined
    : pretty({
        colorize: true,
        ignore: "pid,hostname",
      });

  const pinoInstance = pino({ level: env.LOG_LEVEL as Level }, stream);

  return honoPinoLogger({
    pino: pinoInstance,
  });
}
