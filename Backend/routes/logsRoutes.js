import express from "express";
import { createLog, getLogs } from "../models/logsModel.js";
const router = express.Router();

router.post("/generate", (req, res) => {
  const log = {
    timestamp: new Date().toISOString(),
    user: req.body.user,
    action: req.body.action,
    resource: req.body.resource,
    ip: req.body.ip,
    risk_score: req.body.risk_score
  };

  createLog(log, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Log inserted", log });
  });
});

router.get("/", (req, res) => {
  getLogs((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

export default router;
