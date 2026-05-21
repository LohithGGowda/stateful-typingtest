/**
 * db.js
 * SQLite database using Node.js built-in `node:sqlite` module.
 * Available since Node.js v22.5.0 — no npm package required.
 *
 * Database file: DATA_DIR/typing.db (default: ./data/typing.db)
 */

"use strict";

const path = require("path");
const fs   = require("fs");
const { DatabaseSync } = require("node:sqlite");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DB_PATH  = path.join(DATA_DIR, "typing.db");

// Ensure data directory exists
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

// ── Pragmas ───────────────────────────────────────────────────────────────────

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS attendees (
    usn           TEXT    PRIMARY KEY,
    name          TEXT    NOT NULL,
    role          TEXT    NOT NULL CHECK(role IN ('student', 'faculty')),
    department    TEXT    NOT NULL DEFAULT '',
    designation   TEXT    NOT NULL DEFAULT '',
    registered_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
  );

  CREATE TABLE IF NOT EXISTS scores (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    usn          TEXT    NOT NULL,
    name         TEXT    NOT NULL,
    role         TEXT    NOT NULL DEFAULT 'student',
    department   TEXT    NOT NULL DEFAULT '',
    designation  TEXT    NOT NULL DEFAULT '',
    wpm          INTEGER NOT NULL DEFAULT 0,
    accuracy     REAL    NOT NULL DEFAULT 0,
    fair_score   REAL    NOT NULL DEFAULT 0,
    submitted_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    FOREIGN KEY (usn) REFERENCES attendees(usn) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_scores_fair ON scores(fair_score DESC);
  CREATE INDEX IF NOT EXISTS idx_scores_role ON scores(role);
`);

// ── Migration: add fair_score to existing databases ───────────────────────────
// Safe no-op if the column already exists (SQLite ignores duplicate ADD COLUMN
// only via try/catch since it doesn't support IF NOT EXISTS for columns).
try {
  db.exec(`ALTER TABLE scores ADD COLUMN fair_score REAL NOT NULL DEFAULT 0`);
  // Back-fill existing rows using the same formula: wpm * (accuracy/100)^2
  db.exec(`UPDATE scores SET fair_score = ROUND(wpm * ((accuracy / 100.0) * (accuracy / 100.0)), 4) WHERE fair_score = 0`);
} catch {
  // Column already exists — nothing to do
}

// ── Prepared statements ───────────────────────────────────────────────────────

const upsertAttendee = db.prepare(`
  INSERT INTO attendees (usn, name, role, department, designation)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(usn) DO UPDATE SET
    name        = excluded.name,
    department  = excluded.department,
    designation = excluded.designation
`);

const insertScore = db.prepare(`
  INSERT INTO scores (usn, name, role, department, designation, wpm, accuracy, fair_score)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const getBestScores = db.prepare(`
  SELECT
    s.usn,
    s.name,
    s.role,
    s.department,
    s.designation,
    s.wpm,
    ROUND(s.accuracy, 1) AS accuracy,
    s.submitted_at        AS timestamp
  FROM scores s
  INNER JOIN (
    SELECT usn, MAX(fair_score) AS best_fair
    FROM scores
    GROUP BY usn
  ) best ON s.usn = best.usn AND s.fair_score = best.best_fair
  ORDER BY s.fair_score DESC
`);

const getBestScoresByRole = db.prepare(`
  SELECT
    s.usn,
    s.name,
    s.role,
    s.department,
    s.designation,
    s.wpm,
    ROUND(s.accuracy, 1) AS accuracy,
    s.submitted_at        AS timestamp
  FROM scores s
  INNER JOIN (
    SELECT usn, MAX(fair_score) AS best_fair
    FROM scores
    WHERE role = ?
    GROUP BY usn
  ) best ON s.usn = best.usn AND s.fair_score = best.best_fair
  WHERE s.role = ?
  ORDER BY s.fair_score DESC
`);

const deleteAllScores = db.prepare(`DELETE FROM scores`);

const getAllAttendees = db.prepare(`
  SELECT usn, name, role, department, designation, registered_at AS timestamp
  FROM attendees
  ORDER BY registered_at ASC
`);

// ── Exported helpers (wrap prepared statements for clean call signatures) ─────

module.exports = {
  upsertAttendee(data) {
    return upsertAttendee.run(
      data.usn, data.name, data.role, data.department, data.designation
    );
  },

  insertScore(data) {
    return insertScore.run(
      data.usn, data.name, data.role, data.department, data.designation,
      data.wpm, data.accuracy, data.fair_score
    );
  },

  getBestScores() {
    return getBestScores.all();
  },

  getBestScoresByRole(role) {
    return getBestScoresByRole.all(role, role);
  },

  deleteAllScores() {
    return deleteAllScores.run();
  },

  getAllAttendees() {
    return getAllAttendees.all();
  },
};
