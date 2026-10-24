import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "clients.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function createDb() {
  const fs = require("fs") as typeof import("fs");
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT,
      phone TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      billing_type TEXT NOT NULL CHECK (billing_type IN ('monthly','yearly','lifetime','one_time')),
      amount REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      start_date TEXT,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','completed','cancelled')),
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_services_client ON services(client_id);
  `);

  return db;
}

export const db = globalThis.__db ?? createDb();
if (process.env.NODE_ENV !== "production") globalThis.__db = db;
