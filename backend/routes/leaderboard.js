/**
 * routes/leaderboard.js
 * GET    /api/leaderboard              — all scores (best per USN), WPM desc
 * GET    /api/leaderboard?role=student — filtered by role
 * DELETE /api/leaderboard              — admin reset (password in body)
 */

"use strict";

const express = require("express");
const db      = require("../db");

const router = express.Router();

const RESET_PASSWORD = process.env.RESET_PASSWORD || "RCB";

// GET /api/leaderboard
router.get("/", (req, res) => {
  try {
    const { role } = req.query;
    console.log(`[GET /api/leaderboard] role=${role || 'all'}`);
    
    const entries = (role === "student" || role === "faculty")
      ? db.getBestScoresByRole(role)
      : db.getBestScores();

    console.log(`[GET /api/leaderboard] Found ${entries.length} entries for role=${role || 'all'}`);
    return res.json({ success: true, count: entries.length, entries });
  } catch (err) {
    console.error("[GET /api/leaderboard]", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch leaderboard" });
  }
});

// DELETE /api/leaderboard
router.delete("/", (req, res) => {
  const { password } = req.body || {};

  if (!password || password !== RESET_PASSWORD) {
    return res.status(401).json({ success: false, error: "Invalid admin password" });
  }

  try {
    db.deleteAllScores();
    return res.json({ success: true, message: "Leaderboard cleared" });
  } catch (err) {
    console.error("[DELETE /api/leaderboard]", err.message);
    return res.status(500).json({ success: false, error: "Failed to reset leaderboard" });
  }
});

module.exports = router;
