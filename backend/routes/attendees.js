/**
 * routes/attendees.js
 * POST /api/attendees  — register a participant
 * GET  /api/attendees  — list all attendees (admin use)
 */

"use strict";

const express = require("express");
const db      = require("../db");

const router = express.Router();

const USN_REGEX = /^[0-9][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}$/;

function validateAttendee(body) {
  const errors = [];
  const { usn, name, role, department } = body;

  if (!name || typeof name !== "string" || !name.trim())
    errors.push("name is required");

  if (!role || !["student", "faculty"].includes(role))
    errors.push("role must be 'student' or 'faculty'");

  if (!usn || typeof usn !== "string" || !usn.trim())
    errors.push("usn is required");

  if (role === "student" && usn && !USN_REGEX.test(usn.trim().toUpperCase()))
    errors.push("usn format invalid — expected e.g. 1DB23CS121");

  if (!department || typeof department !== "string" || !department.trim())
    errors.push("department is required");

  return errors;
}

// POST /api/attendees
router.post("/", (req, res) => {
  const errors = validateAttendee(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const { name, usn, role, department, designation = "" } = req.body;

  try {
    db.upsertAttendee({
      usn:         usn.trim().toUpperCase(),
      name:        name.trim(),
      role,
      department:  department.trim(),
      designation: designation.trim(),
    });
    return res.status(201).json({
      success: true,
      message: "Attendee registered",
      usn: usn.trim().toUpperCase(),
    });
  } catch (err) {
    console.error("[POST /api/attendees]", err.message);
    return res.status(500).json({ success: false, error: "Failed to register attendee" });
  }
});

// GET /api/attendees
router.get("/", (req, res) => {
  try {
    const attendees = db.getAllAttendees();
    return res.json({ success: true, count: attendees.length, attendees });
  } catch (err) {
    console.error("[GET /api/attendees]", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch attendees" });
  }
});

module.exports = router;
