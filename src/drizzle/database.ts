import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import * as schema from "./schema.ts";

const dbPath = path.join(__dirname, "../../data/bookmarks.db");
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });

export function initializeDatabase() {
  // Drizzle will handle schema creation through migrations
  console.log("Database initialized with Drizzle ORM");
}

export function closeDatabase() {
  sqlite.close();
}
