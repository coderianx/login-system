const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "users.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ DB bağlantı hatası:", err.message);
  else console.log("✅ SQLite bağlantısı kuruldu");
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

module.exports = db;
