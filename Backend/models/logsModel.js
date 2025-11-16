import pkg from "sqlite3";
const { Database } = pkg;

const db = new Database("./logs.db");

// The updated schema now includes the new SPEDIA-compatible fields (cc, bcc, to, url)
// and changes risk_score (INT) to risk_description (TEXT)
const createTable = () => {
  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    user TEXT,
    action TEXT,
    resource TEXT,
    ip TEXT,
    risk_description TEXT, 
    agent_name TEXT,
    decoder_name TEXT,
    activity TEXT,
    level INTEGER,
    size INTEGER,
    -- NEW COLUMNS FOR SPEDIA SIMULATION
    cc TEXT, 
    bcc TEXT,
    "to" TEXT,
    url TEXT 
  )`);
};

// Insert a new log entry
export const createLog = (log, callback) => {
  const { 
    timestamp, user, action, resource, ip, risk_description, 
    agent_name, decoder_name, activity, level, size,
    cc, bcc, to, url
  } = log;
  
  db.run(
    `INSERT INTO logs (timestamp, user, action, resource, ip, risk_description, agent_name, decoder_name, activity, level, size, cc, bcc, "to", url) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [timestamp, user, action, resource, ip, risk_description, 
     agent_name, decoder_name, activity, level, size, 
     cc, bcc, to, url],
    callback
  );
};

// Retrieve all logs
export const getLogs = (callback) => {
  db.all("SELECT * FROM logs ORDER BY timestamp DESC", callback);
};

// Initialize the database on startup
createTable();