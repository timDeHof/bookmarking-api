import app from "./server";

const port = process.env.PORT || 3000;

console.log(`Server is running on http://localhost:${port}`);

Bun.serve({
  fetch: app.fetch,
  port,
});
