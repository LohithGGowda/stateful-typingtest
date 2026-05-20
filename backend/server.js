/**
 * server.js
 * Express server for the AWS Typing Challenge backend.
 *
 * Endpoints:
 *   POST   /api/attendees    — register participant
 *   GET    /api/attendees    — list all attendees
 *   POST   /api/scores       — submit typing score
 *   GET    /api/leaderboard  — get leaderboard (all or by role)
 *   DELETE /api/leaderboard  — admin reset
 *   GET    /api/health       — health check
 *
 * In production the server also serves the React build from ../dist
 */

"use strict";

const path    = require("path");
const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");

const attendeesRouter  = require("./routes/attendees");
const scoresRouter     = require("./routes/scores");
const leaderboardRouter = require("./routes/leaderboard");

const app  = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// ── Security & logging ────────────────────────────────────────────────────────

app.use(helmet({
  // Allow serving the React SPA assets
  contentSecurityPolicy: false,
}));

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// ── CORS ──────────────────────────────────────────────────────────────────────
// In development the Vite dev server runs on a different port.
// In production everything is served from the same origin so CORS is not needed,
// but we keep it permissive for flexibility (e.g. separate frontend host).

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (same-origin, curl, Postman)
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    // In production allow same-origin requests
    if (NODE_ENV === "production") return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Body parsing ──────────────────────────────────────────────────────────────

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false }));

// ── API routes ────────────────────────────────────────────────────────────────

app.use("/api/attendees",  attendeesRouter);
app.use("/api/scores",     scoresRouter);
app.use("/api/leaderboard", leaderboardRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status:  "ok",
    service: "aws-typing-backend",
    env:     NODE_ENV,
    time:    new Date().toISOString(),
  });
});

// ── Serve React SPA in production ─────────────────────────────────────────────
// The Dockerfile copies the Vite build output to /app/dist

if (NODE_ENV === "production") {
  const DIST = path.join(__dirname, "..", "dist");
  app.use(express.static(DIST));

  // All non-API routes → index.html (SPA client-side routing)
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(DIST, "index.html"));
  });
}

// ── Global error handler ──────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[Unhandled error]", err.message);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[aws-typing-backend] listening on port ${PORT} (${NODE_ENV})`);
});

module.exports = app; // exported for testing
