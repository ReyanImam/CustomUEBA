import express from "express";
import { createLog, getLogs } from "../models/logsModel.js";
import axios from 'axios';
const router = express.Router();

const ANALYTICS_API_URL = "http://localhost:5001";

router.post("/generate", (req, res) => {
  // Extract all expected fields from the request body
  const {
    user,
    action,
    resource,
    ip,
    risk_description, // RENAMED FIELD
    agent_name,
    decoder_name,
    activity,
    level,
    size,
    cc,           // NEW
    bcc,          // NEW
    to,           // NEW
    url           // NEW
  } = req.body;

  const log = {
    timestamp: new Date().toISOString(),
    user,
    action,
    resource,
    ip,
    risk_description,
    agent_name,
    decoder_name,
    activity,
    level,
    size,
    cc,
    bcc,
    to,
    url
  };

  createLog(log, err => {
    if (err) {
      console.error("DATABASE INSERTION ERROR:", err);
      // Return a detailed error response for debugging
      return res.status(500).json({ error: "Failed to insert log into database.", details: err.message });
    }

    res.json({ message: "Log inserted", log });
  });
});

router.get("/", (req, res) => {
  getLogs((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint to trigger model training
router.post("/model/train", async (req, res) => {
  try {
    const response = await axios.post(`${ANALYTICS_API_URL}/model/train`);
    res.json(response.data);
  } catch (error) {
    console.error("Error connecting to analytics service:", error.message);
    // Respond with a placeholder error message or a generic failure status
    res.status(503).json({ 
        error: "Analytics service unavailable or failed to process request.",
        details: error.message
    });
  }
});

export default router;