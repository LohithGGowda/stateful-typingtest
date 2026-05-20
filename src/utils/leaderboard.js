/**
 * leaderboard.js
 * API client for leaderboard and score operations.
 *
 * In production the backend serves both the API and the React SPA from the
 * same origin, so BASE_URL defaults to "" (same-origin).
 * Override with VITE_API_BASE_URL in your .env file during development:
 *   VITE_API_BASE_URL=http://localhost:3001
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Leaderboard reads ─────────────────────────────────────────────────────────

/**
 * Fetch all scores sorted by WPM descending.
 * @returns {Promise<Array>}
 */
export async function getLeaderboard() {
  try {
    const data = await apiFetch("/api/leaderboard");
    return data.entries ?? [];
  } catch (err) {
    console.error("[getLeaderboard]", err.message);
    return [];
  }
}

/**
 * Fetch scores filtered by role, sorted by WPM descending.
 * @param {"student"|"faculty"} role
 * @returns {Promise<Array>}
 */
export async function getLeaderboardByRole(role) {
  try {
    const data = await apiFetch(`/api/leaderboard?role=${encodeURIComponent(role)}`);
    return data.entries ?? [];
  } catch (err) {
    console.error("[getLeaderboardByRole]", err.message);
    return [];
  }
}

// ── Score submission ──────────────────────────────────────────────────────────

/**
 * Submit a participant's score to the backend.
 * Also registers the attendee if not already registered.
 * @param {{ name, usn, role, department, designation, wpm, accuracy }} entry
 * @returns {Promise<boolean>} true on success
 */
export async function saveScore({ name, usn, role = "student", department = "", designation = "", wpm, accuracy }) {
  try {
    await apiFetch("/api/scores", {
      method: "POST",
      body: JSON.stringify({ name, usn, role, department, designation, wpm, accuracy }),
    });
    return true;
  } catch (err) {
    console.error("[saveScore]", err.message);
    return false;
  }
}

// ── Attendee registration ─────────────────────────────────────────────────────

/**
 * Register a participant (called at the registration step).
 * @param {{ name, usn, role, department, designation }} attendee
 * @returns {Promise<boolean>} true on success
 */
export async function registerAttendee({ name, usn, role, department, designation = "" }) {
  try {
    await apiFetch("/api/attendees", {
      method: "POST",
      body: JSON.stringify({ name, usn, role, department, designation }),
    });
    return true;
  } catch (err) {
    console.error("[registerAttendee]", err.message);
    return false;
  }
}

// ── Admin reset ───────────────────────────────────────────────────────────────

/**
 * Clear all leaderboard scores (requires admin password).
 * @param {string} password
 * @returns {Promise<boolean>} true on success
 */
export async function clearLeaderboard(password) {
  try {
    await apiFetch("/api/leaderboard", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    });
    return true;
  } catch (err) {
    console.error("[clearLeaderboard]", err.message);
    return false;
  }
}
