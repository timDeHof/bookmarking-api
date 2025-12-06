import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const bookmarks = sqliteTable("bookmarks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  title: text("title").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now') * 1000)`).$onUpdate(() => new Date()),
});

export const selectBookmarksSchema = createSelectSchema(bookmarks);
export const insertBookmarkSchema = createInsertSchema(bookmarks, {
  title: schema => schema.min(1).max(200),
}).required({
  url: true,
  title: true,
}).omit({ id: true, createdAt: true, updatedAt: true });

export const bookmarkTags = sqliteTable("bookmark_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookmarkId: integer("bookmark_id")
    .notNull()
    .references(() => bookmarks.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});

export const bookmarksRelations = relations(bookmarks, ({ many }) => ({
  tags: many(bookmarkTags),
}));

export const bookmarkTagsRelations = relations(bookmarkTags, ({ one }) => ({
  bookmark: one(bookmarks, {
    fields: [bookmarkTags.bookmarkId],
    references: [bookmarks.id],
  }),
}));

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
export type BookmarkTag = typeof bookmarkTags.$inferSelect;
export type NewBookmarkTag = typeof bookmarkTags.$inferInsert;
