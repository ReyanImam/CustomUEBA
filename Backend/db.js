import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./logs.db");

db.run(`
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT,
  user TEXT,
  action TEXT,
  resource TEXT,
  ip TEXT,
  risk_score INTEGER
)
`);

export default db;
