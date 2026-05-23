# Changelog - Typing Test Application

## Latest Updates (May 23, 2026)

### ✅ Feedback System
**Added user feedback collection after typing test completion**

- **New Route:** `/feedback` - Appears after test, before results
- **UI:** 5 emoji rating system (😞 😕 😐 😊 😍)
- **Database:** `feedback` column added to `scores` table (INTEGER 1-5, nullable)
- **Privacy:** Feedback is stored but never displayed publicly
- **Optional:** Users can skip feedback submission

**Files Added:**
- `src/components/FeedbackScreen.jsx`
- `src/pages/FeedbackPage.jsx`
- CSS styles for `.feedback-emoji` buttons

**Files Modified:**
- `backend/db.js` - Added feedback column + migration
- `backend/routes/scores.js` - Accept and store feedback
- `src/App.jsx` - Added /feedback route
- `src/pages/TestPage.jsx` - Navigate to /feedback after test
- `src/pages/ResultsPage.jsx` - Navigate to /appreciation after results
- `src/index.css` - Added feedback emoji styles

### ✅ Faculty Leaderboard Fix
**Fixed issue where faculty leaderboard wasn't updating correctly**

**Problem:** SQL query could return duplicate rows when users had multiple scores with the same `fair_score`, causing incorrect leaderboard display.

**Solution:** 
- Added `MAX(submitted_at)` to subquery to get the latest submission
- Added timestamp to JOIN condition to ensure only one row per user
- Added `submitted_at DESC` as tie-breaker in ORDER BY

**Files Modified:**
- `backend/db.js` - Updated `getBestScores` and `getBestScoresByRole` queries

**Before:**
```sql
SELECT usn, MAX(fair_score) AS best_fair
FROM scores WHERE role = ?
GROUP BY usn
```

**After:**
```sql
SELECT usn, MAX(fair_score) AS best_fair, MAX(submitted_at) AS latest_time
FROM scores WHERE role = ?
GROUP BY usn
```

### ✅ Debug Logging
**Added console logging for troubleshooting**

- `backend/routes/leaderboard.js` - Logs role filter and entry count
- `backend/routes/scores.js` - Logs each score submission with role, WPM, accuracy, and fair_score

### ✅ Paragraph Completion Logic
**Changed test completion behavior**

**Before:** Test only completed early if user typed the entire paragraph with 100% accuracy

**After:** Test completes when user reaches the last character, regardless of accuracy
- WPM calculated based on actual time taken
- Accuracy reflects real correctness percentage

**Files Modified:**
- `src/components/TypingTest.jsx` - Changed completion check from `next === sourceText` to `next.length >= sourceText.length`

### ✅ Fair Scoring System
**Added hidden ranking score for leaderboard fairness**

**Formula:** `fair_score = WPM × (accuracy/100)²`

**Effect:**
- 100 WPM @ 100% accuracy → 100.0 score
- 100 WPM @ 88% accuracy → 77.4 score
- 100 WPM @ 80% accuracy → 64.0 score
- 80 WPM @ 100% accuracy → 80.0 score

**Implementation:**
- Stored in database but never exposed to frontend
- Leaderboard ranks by `fair_score` instead of raw WPM
- Frontend still displays WPM and accuracy as before

**Files Modified:**
- `backend/db.js` - Added `fair_score` column, updated queries to rank by it
- `backend/routes/scores.js` - Calculate and store fair_score on submission

---

## Testing Checklist

### Feedback System
- [ ] Complete typing test
- [ ] Verify /feedback page appears with 5 emojis
- [ ] Select an emoji and submit
- [ ] Verify score appears on /results page
- [ ] Check database: `SELECT feedback FROM scores ORDER BY id DESC LIMIT 5;`
- [ ] Verify feedback is NOT displayed on leaderboard

### Faculty Leaderboard
- [ ] Register as Faculty member
- [ ] Complete typing test
- [ ] Navigate to /leaderboard
- [ ] Verify faculty score appears in Faculty panel
- [ ] Submit multiple scores as same faculty member
- [ ] Verify only best score appears (no duplicates)

### Fair Scoring
- [ ] Submit score with 100 WPM @ 80% accuracy
- [ ] Submit score with 80 WPM @ 100% accuracy
- [ ] Verify 80 WPM @ 100% ranks higher on leaderboard
- [ ] Verify frontend still shows WPM and accuracy (not fair_score)

### Debug Logging
- [ ] Start backend with `node server.js`
- [ ] Submit a score - check console for `[POST /api/scores]` log
- [ ] Load leaderboard - check console for `[GET /api/leaderboard]` logs
- [ ] Verify role and entry counts are logged correctly

---

## Database Schema

### scores table
```sql
CREATE TABLE scores (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  usn          TEXT    NOT NULL,
  name         TEXT    NOT NULL,
  role         TEXT    NOT NULL DEFAULT 'student',
  department   TEXT    NOT NULL DEFAULT '',
  designation  TEXT    NOT NULL DEFAULT '',
  wpm          INTEGER NOT NULL DEFAULT 0,
  accuracy     REAL    NOT NULL DEFAULT 0,
  fair_score   REAL    NOT NULL DEFAULT 0,      -- NEW: Hidden ranking score
  feedback     INTEGER DEFAULT NULL,             -- NEW: User feedback (1-5)
  submitted_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (usn) REFERENCES attendees(usn) ON DELETE CASCADE
);
```

---

## Migration Notes

All changes include automatic migrations:
- Existing databases will have `fair_score` and `feedback` columns added on startup
- Existing scores will have `fair_score` back-filled automatically
- No manual database updates required
