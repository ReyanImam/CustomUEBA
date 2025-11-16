import db from "../db.js";

export const createLog = (log, callback) => {
  const query = `
    INSERT INTO logs (timestamp, user, action, resource, ip, risk_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(query, Object.values(log), callback);
};

export const getLogs = callback => {
  db.all("SELECT * FROM logs", [], callback);
};
