import app from "./server";
import { serve } from "@hono/node-server";

const port = process.env.PORT || 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
