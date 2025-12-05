import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";
import * as schema from "./schema.ts";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://bookmark_user:bookmark_password@localhost:5432/bookmark_db";

const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export function initializeDatabase() {
  console.log("PostgreSQL database initialized with Drizzle ORM");
  return client;
}

export function closeDatabase() {
  client.end();
}
