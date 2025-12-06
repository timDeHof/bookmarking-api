import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import bookmarks from "@/routes/Bookmarks/bookmarks.index";
import index from "@/routes/index.route";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  bookmarks,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

app.get("/error", (c) => {
  c.status(422);
  throw new Error("Error");
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

export type AppType = typeof routes[number];

export default app;
