// import path from 'node:path'
// import Database from 'better-sqlite3'

// const dbPath = path.join(__dirname, '../data/bookmarks.db')
// const db = new Database(dbPath)

// export function initializeDatabase() {
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS bookmarks (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       url TEXT NOT NULL,
//       title TEXT NOT NULL,
//       notes TEXT,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS bookmark_tags (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       bookmark_id INTEGER NOT NULL,
//       tag TEXT NOT NULL,
//       FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
//     );

//     CREATE INDEX IF NOT EXISTS idx_bookmark_tags ON bookmark_tags(tag);
//     CREATE INDEX IF NOT EXISTS idx_bookmark_url ON bookmarks(url);
//   `)
// }

// export function closeDatabase() {
//   db.close()
// }

// export { db as default }
