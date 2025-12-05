import { db } from "./database";
import { bookmarks, bookmarkTags, NewBookmark, NewBookmarkTag } from "./schema";
import { eq, and } from "drizzle-orm";
import { BookmarkWithTags } from "../models/bookmark";

export class DrizzleBookmarkRepository {
  static async create(bookmarkData: {
    url: string;
    title: string;
    notes?: string;
    tags?: string[];
  }): Promise<BookmarkWithTags> {
    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Create the bookmark
      const [createdBookmark] = await tx
        .insert(bookmarks)
        .values({
          url: bookmarkData.url,
          title: bookmarkData.title,
          notes: bookmarkData.notes || "",
        })
        .returning();

      // Create tags if any
      if (bookmarkData.tags && bookmarkData.tags.length > 0) {
        const tagValues: NewBookmarkTag[] = bookmarkData.tags.map((tag) => ({
          bookmarkId: createdBookmark.id,
          tag: tag.trim(),
        }));

        await tx.insert(bookmarkTags).values(tagValues);
      }

      return createdBookmark;
    });

    return this.getById(result.id);
  }

  static async getAll(tagFilter?: string): Promise<BookmarkWithTags[]> {
    let query = db.query.bookmarks.findMany({
      with: {
        tags: true,
      },
      orderBy: (bookmarks: any, { desc }: any) => [desc(bookmarks.createdAt)],
    });

    if (tagFilter) {
      query = db.query.bookmarks.findMany({
        with: {
          tags: true,
        },
        where: (bookmarks: any, { eq }: any) =>
          eq(bookmarks.tags.tag, tagFilter),
        orderBy: (bookmarks: any, { desc }: any) => [desc(bookmarks.createdAt)],
      });
    }

    const bookmarksWithTags = await query;

    return bookmarksWithTags.map((bm: any) => ({
      id: bm.id,
      url: bm.url,
      title: bm.title,
      notes: bm.notes || "",
      tags: bm.tags.map((t: any) => t.tag),
      created_at: bm.createdAt ?? undefined,
      updated_at: bm.updatedAt ?? undefined,
    }));
  }

  static async getById(id: number): Promise<BookmarkWithTags> {
    const bookmark = await db.query.bookmarks.findFirst({
      where: eq(bookmarks.id, id),
      with: {
        tags: true,
      },
    });

    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    return {
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      notes: bookmark.notes || "",
      tags: bookmark.tags.map((t: any) => t.tag),
      created_at: bookmark.createdAt ?? undefined,
      updated_at: bookmark.updatedAt ?? undefined,
    };
  }

  static async update(
    id: number,
    bookmarkData: {
      url?: string;
      title?: string;
      notes?: string;
      tags?: string[];
    }
  ): Promise<BookmarkWithTags> {
    return await db.transaction(async (tx) => {
      // Update the bookmark
      const updatedBookmark = await tx
        .update(bookmarks)
        .set({
          url: bookmarkData.url,
          title: bookmarkData.title,
          notes: bookmarkData.notes,
          updatedAt: "CURRENT_TIMESTAMP",
        })
        .where(eq(bookmarks.id, id))
        .returning();

      if (updatedBookmark.length === 0) {
        throw new Error("Bookmark not found");
      }

      // Delete existing tags
      await tx.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, id));

      // Add new tags if provided
      if (bookmarkData.tags && bookmarkData.tags.length > 0) {
        const tagValues: NewBookmarkTag[] = bookmarkData.tags.map((tag) => ({
          bookmarkId: id,
          tag: tag.trim(),
        }));

        await tx.insert(bookmarkTags).values(tagValues);
      }

      return this.getById(id);
    });
  }

  static async delete(id: number): Promise<void> {
    const result = await db.delete(bookmarks).where(eq(bookmarks.id, id));

    if (result.changes === 0) {
      throw new Error("Bookmark not found");
    }
  }
}
