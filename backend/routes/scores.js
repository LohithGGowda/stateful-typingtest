/**
 * routes/scores.js
 * POST /api/scores  — submit a typing score
 */

"use strict";

const express = require("express");
const db      = require("../db");

const router = express.Router();

function validateScore(body) {
  const errors = [];
  const { usn, name, wpm, accuracy } = body;

  if (!usn || typeof usn !== "string" || !usn.trim())
    errors.push("usn is required");

  if (!name || typeof name !== "string" || !name.trim())
    errors.push("name is required");

  if (wpm === undefined || wpm === null || isNaN(Number(wpm)) || Number(wpm) < 0)
    errors.push("wpm must be a non-negative number");

  if (accuracy === undefined || accuracy === null || isNaN(Number(accuracy)) ||
      Number(accuracy) < 0 || Number(accuracy) > 100)
    errors.push("accuracy must be a number between 0 and 100");

  return errors;
}

// POST /api/scores
router.post("/", (req, res) => {
  const errors = validateScore(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const {
    usn,
    name,
    role        = "student",
    department  = "",
    designation = "",
    wpm,
    accuracy,
    feedback,
  } = req.body;

  const cleanUsn  = usn.trim().toUpperCase();
  const cleanWpm  = Math.round(Number(wpm));
  const cleanAcc  = parseFloat(Number(accuracy).toFixed(1));
  const cleanFeedback = (feedback && Number.isInteger(Number(feedback)) && feedback >= 1 && feedback <= 5)
    ? Number(feedback)
    : null;

  // Fair ranking score — never exposed to the frontend.
  // Formula: WPM × (accuracy/100)²
  // Effect: 100 WPM @ 100% acc → 100.0
  //         100 WPM @  80% acc →  64.0
  //         100 WPM @  60% acc →  36.0
  // Heavily penalises low accuracy while still rewarding raw speed.
  const fairScore = parseFloat((cleanWpm * Math.pow(cleanAcc / 100, 2)).toFixed(4));

  console.log(`[POST /api/scores] Submitting score: usn=${cleanUsn}, role=${role}, wpm=${cleanWpm}, acc=${cleanAcc}, fair=${fairScore}`);

  try {
    // Upsert attendee so score submission alone is sufficient
    db.upsertAttendee({
      usn:         cleanUsn,
      name:        name.trim(),
      role,
      department:  department.trim(),
      designation: designation.trim(),
    });

    db.insertScore({
      usn:         cleanUsn,
      name:        name.trim(),
      role,
      department:  department.trim(),
      designation: designation.trim(),
      wpm:         cleanWpm,
      accuracy:    cleanAcc,
      fair_score:  fairScore,
      feedback:    cleanFeedback,
    });

    return res.status(201).json({
      success: true,
      message: "Score submitted",
      usn: cleanUsn,
      wpm: cleanWpm,
    });
  } catch (err) {
    console.error("[POST /api/scores]", err.message);
    return res.status(500).json({ success: false, error: "Failed to submit score" });
  }
});

module.exports = router;
