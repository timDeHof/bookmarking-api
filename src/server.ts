import process from "node:process";

import { closeDatabase, initializeDatabase } from "./db/database";
import { DrizzleBookmarkRepository as BookmarkRepository } from "./db/repository";
import createApp from "./lib/create-app";
import {
  bookmarkSchema,
  bookmarkUpdateSchema,
} from "./validation/bookmarkSchema";

// Initialize database
initializeDatabase();

const app = createApp();

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Create bookmark
app.post("/bookmarks", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = bookmarkSchema.parse(body);

    const bookmark = await BookmarkRepository.create({
      url: validatedData.url,
      title: validatedData.title,
      notes: validatedData.notes,
      tags: validatedData.tags,
    });

    return c.json(bookmark, 201);
  }
  catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Invalid request" }, 400);
  }
});

// Get all bookmarks with optional tag filter
app.get("/bookmarks", async (c) => {
  try {
    const tagFilter = c.req.query("tag");
    const bookmarks = await BookmarkRepository.getAll(tagFilter);
    return c.json(bookmarks);
  }
  catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get single bookmark
app.get("/bookmarks/:id", async (c) => {
  try {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid bookmark ID" }, 400);
    }

    const bookmark = await BookmarkRepository.getById(id);
    return c.json(bookmark);
  }
  catch (error) {
    if (error instanceof Error) {
      if (error.message === "Bookmark not found") {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update bookmark
app.put("/bookmarks/:id", async (c) => {
  try {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid bookmark ID" }, 400);
    }

    const body = await c.req.json();
    const validatedData = bookmarkUpdateSchema.parse(body);

    const updatedBookmark = await BookmarkRepository.update(id, {
      url: validatedData.url,
      title: validatedData.title,
      notes: validatedData.notes,
      tags: validatedData.tags,
    });

    return c.json(updatedBookmark);
  }
  catch (error) {
    if (error instanceof Error) {
      if (error.message === "Bookmark not found") {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Invalid request" }, 400);
  }
});

// Delete bookmark
app.delete("/bookmarks/:id", async (c) => {
  try {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid bookmark ID" }, 400);
    }

    await BookmarkRepository.delete(id);
    return c.json({ message: "Bookmark deleted successfully" });
  }
  catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Error handling middleware
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// Clean up on process exit
process.on("SIGINT", () => {
  closeDatabase();
  process.exit();
});

process.on("SIGTERM", () => {
  closeDatabase();
  process.exit();
});

export default app;
