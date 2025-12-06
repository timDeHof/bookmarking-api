import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "stoker/openapi";

import type { AppBindings } from "@/lib/types"; // Custom types for context

import { env } from "@/env";
import { pinoLogger } from "@/middlewares/pino-logger";
// ... import other middlewares

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  // Apply global middlewares
  app.use(pinoLogger());
  // ... app.notFound(), app.onError()

  app.notFound((c) => {
    return c.json({ message: `Not Found: ${c.req.path}` }, 404);
  });

  app.onError((err, c) => {
    console.error("Unhandled application error:", err);

    const errorResponse: { message: string; stack?: string } = {
      message: "An unexpected error occurred.",
    };

    // Include stack trace only in non-production environments
    if (env.NODE_ENV !== "production") {
      errorResponse.stack = err.stack;
      errorResponse.message = err.message; // More specific message in dev
    }

    return c.json(errorResponse, 500);
  });
  return app;
}
