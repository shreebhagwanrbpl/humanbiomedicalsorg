import path from "node:path";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";

let sqliteDatabase = null;

/**
 * Get or initialize SQLite Database connection (Read-Only)
 */
export function getSqliteDb() {
  if (sqliteDatabase) return sqliteDatabase;

  try {
    // Potential paths for catalog.db
    const candidatePaths = [
      process.env.SQLITE_DB_PATH,
      path.resolve(process.cwd(), "..", "SuperAdminRBPL", "data", "catalog.db"),
      path.resolve(process.cwd(), "data", "catalog.db"),
      "c:\\Users\\Admin\\Documents\\GitHub\\SuperAdminRBPL\\data\\catalog.db",
      "/var/www/SuperAdminRBPL/data/catalog.db",
    ].filter(Boolean);

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        sqliteDatabase = new DatabaseSync(p, { open: true, readOnly: true });
        console.log(`[SQLite] Successfully connected to catalog database at: ${p}`);
        return sqliteDatabase;
      }
    }
  } catch (err) {
    console.warn("[SQLite] DatabaseSync initialization warning:", err.message);
  }

  return null;
}

/**
 * Query a single document by exact path from SQLite documents table
 */
export function getDocFromSqlite(docPath) {
  const db = getSqliteDb();
  if (!db) return null;
  try {
    const cleanPath = String(docPath || "").replace(/^\/+|\/+$/g, "");
    const stmt = db.prepare("SELECT data FROM documents WHERE path = ?");
    const row = stmt.get(cleanPath);
    if (row && row.data) {
      return JSON.parse(row.data);
    }
  } catch (err) {
    console.error(`[SQLite] getDoc error for path "${docPath}":`, err.message);
  }
  return null;
}

/**
 * Query all documents in a collection path from SQLite documents table
 */
export function getCollectionFromSqlite(collectionPath) {
  const db = getSqliteDb();
  if (!db) return [];
  try {
    const cleanColPath = String(collectionPath || "").replace(/^\/+|\/+$/g, "");
    const stmt = db.prepare("SELECT doc_id, data FROM documents WHERE collection_path = ?");
    const rows = stmt.all(cleanColPath);
    return (rows || []).map((r) => ({ id: r.doc_id, ...JSON.parse(r.data) }));
  } catch (err) {
    console.error(`[SQLite] getCollection error for "${collectionPath}":`, err.message);
  }
  return [];
}
