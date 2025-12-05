import db from "../database";
import { Bookmark, BookmarkWithTags } from "../models/bookmark";

export class BookmarkRepository {
  static create(bookmark: Bookmark): BookmarkWithTags {
    const stmt = db.prepare(`
      INSERT INTO bookmarks (url, title, notes)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(bookmark.url, bookmark.title, bookmark.notes || "");

    const bookmarkId = result.lastInsertRowid;

    if (bookmark.tags && bookmark.tags.length > 0) {
      const tagStmt = db.prepare(`
        INSERT INTO bookmark_tags (bookmark_id, tag)
        VALUES (?, ?)
      `);

      const insertMany = db.transaction((tags: string[]) => {
        for (const tag of tags) {
          tagStmt.run(bookmarkId, tag);
        }
      });

      insertMany(bookmark.tags);
    }

    return this.getById(bookmarkId as number);
  }

  static getAll(tagFilter?: string): BookmarkWithTags[] {
    let query = `
      SELECT b.*, GROUP_CONCAT(DISTINCT bt.tag) as tags
      FROM bookmarks b
      LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
    `;

    const params: any[] = [];

    if (tagFilter) {
      query += " WHERE bt.tag = ?";
      params.push(tagFilter);
    }

    query += " GROUP BY b.id ORDER BY b.created_at DESC";

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map((row: any) => ({
      id: row.id,
      url: row.url,
      title: row.title,
      notes: row.notes,
      tags: row.tags ? row.tags.split(",") : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }

  static getById(id: number): BookmarkWithTags {
    const bookmarkStmt = db.prepare(`
      SELECT * FROM bookmarks WHERE id = ?
    `);

    const bookmark: any = bookmarkStmt.get(id);

    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    const tagsStmt = db.prepare(`
      SELECT tag FROM bookmark_tags WHERE bookmark_id = ?
    `);

    const tags = tagsStmt.all(id).map((row: any) => row.tag);

    return {
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      notes: bookmark.notes,
      tags,
      created_at: bookmark.created_at,
      updated_at: bookmark.updated_at,
    };
  }

  static update(id: number, bookmark: Bookmark): BookmarkWithTags {
    const stmt = db.prepare(`
      UPDATE bookmarks
      SET url = ?, title = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(bookmark.url, bookmark.title, bookmark.notes || "", id);

    // Delete existing tags
    const deleteTagsStmt = db.prepare(`
      DELETE FROM bookmark_tags WHERE bookmark_id = ?
    `);
    deleteTagsStmt.run(id);

    // Add new tags
    if (bookmark.tags && bookmark.tags.length > 0) {
      const tagStmt = db.prepare(`
        INSERT INTO bookmark_tags (bookmark_id, tag)
        VALUES (?, ?)
      `);

      const insertMany = db.transaction((tags: string[]) => {
        for (const tag of tags) {
          tagStmt.run(id, tag);
        }
      });

      insertMany(bookmark.tags);
    }

    return this.getById(id);
  }

  static delete(id: number): void {
    const stmt = db.prepare(`
      DELETE FROM bookmarks WHERE id = ?
    `);
    stmt.run(id);
  }
}
