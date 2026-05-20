import { useState, useEffect } from "react";
import BrandLayout from "./BrandLayout";
import { getLeaderboardByRole, clearLeaderboard } from "../utils/leaderboard";

const MEDALS = ["🥇", "🥈", "🥉"];

/* ── Single role leaderboard panel ───────────────────────────────────────── */
function RoleBoard({ role, title, icon, accentColor, accentGlow }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      const data = await getLeaderboardByRole(role);
      if (!cancelled) setEntries(data);
    }
    refresh();
    const id = setInterval(refresh, 3000);
    return () => { cancelled = true; clearInterval(id); };
  }, [role]);

  return (
    <div className="lbp-panel" style={{ "--lbp-accent": accentColor, "--lbp-glow": accentGlow }}>

      {/* Panel header */}
      <div className="lbp-header">
        <div className="lbp-header-left">
          <span className="lbp-icon">{icon}</span>
          <div>
            <h2 className="lbp-title">{title}</h2>
            <p className="lbp-count">
              {entries.length} {entries.length === 1 ? "participant" : "participants"}
            </p>
          </div>
        </div>
        <div className="lbp-live-badge" style={{ color: accentColor, borderColor: accentColor, background: `${accentColor}18` }}>
          <span className="lbp-live-dot" style={{ backgroundColor: accentColor }} />
          LIVE
        </div>
      </div>

      {/* Column headings */}
      {entries.length > 0 && (
        <div className="lbp-col-heads">
          <span className="lbp-c-rank">#</span>
          <span className="lbp-c-name">Name</span>
          <span className="lbp-c-dept">Department</span>
          <span className="lbp-c-wpm">WPM</span>
          <span className="lbp-c-acc">Acc</span>
        </div>
      )}

      {/* Rows */}
      <div className="lbp-rows">
        {entries.length === 0 ? (
          <div className="lbp-empty">
            <span className="lbp-empty-icon">{icon}</span>
            <p>No {title.toLowerCase()} scores yet</p>
            <p className="lbp-empty-sub">Be the first to take the challenge!</p>
          </div>
        ) : (
          entries.map((entry, idx) => {
            const rank = idx + 1;
            const isTop = rank <= 3;
            return (
              <div
                key={entry.usn + idx}
                className={`lbp-row ${isTop ? "lbp-row-top" : ""}`}
                style={isTop ? { borderLeftColor: accentColor } : {}}
              >
                {/* Rank */}
                <span className="lbp-c-rank">
                  {rank <= 3
                    ? <span className="lbp-medal">{MEDALS[rank - 1]}</span>
                    : <span className="lbp-rank-num">{rank}</span>}
                </span>

                {/* Name + USN */}
                <span className="lbp-c-name">
                  <span className="lbp-name">{entry.name}</span>
                  <span className="lbp-usn">{entry.usn}</span>
                </span>

                {/* Department (shortened) */}
                <span className="lbp-c-dept lbp-dept" title={entry.department}>
                  {entry.department
                    ? entry.department.replace(/\(.*?\)/g, "").trim()
                    : "—"}
                </span>

                {/* WPM */}
                <span className="lbp-c-wpm">
                  <span
                    className="lbp-wpm"
                    style={rank === 1 ? { color: accentColor } : {}}
                  >
                    {entry.wpm}
                  </span>
                </span>

                {/* Accuracy */}
                <span className="lbp-c-acc lbp-acc">{entry.accuracy}%</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ── Reset modal ─────────────────────────────────────────────────────────── */
function ResetModal({ onClose, onReset }) {
  const [password,   setPassword]   = useState("");
  const [pwError,    setPwError]    = useState("");
  const [success,    setSuccess]    = useState(false);
  const [resetting,  setResetting]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setResetting(true);
    const ok = await clearLeaderboard(password);
    setResetting(false);
    if (!ok) {
      setPwError("Incorrect password or server error. Try again.");
      setPassword("");
      return;
    }
    setSuccess(true);
    setTimeout(() => { onReset(); onClose(); }, 1800);
  }

  return (
    <div className="lb-modal-overlay" onClick={onClose}>
      <div className="lb-modal" onClick={e => e.stopPropagation()}>
        {success ? (
          <div className="lb-modal-success">
            <span className="lb-modal-success-icon">✓</span>
            <p className="lb-modal-success-text">Leaderboard cleared!</p>
          </div>
        ) : (
          <>
            <div className="lb-modal-header">
              <div className="lb-modal-icon-wrap"><span className="lb-modal-icon">⚠️</span></div>
              <h3 className="lb-modal-title">Reset All Scores</h3>
              <p className="lb-modal-subtitle">This clears both Students and Faculty leaderboards. Enter the admin password to continue.</p>
            </div>
            <form onSubmit={handleSubmit} className="lb-modal-form">
              <div>
                <label htmlFor="lbp-pw" className="lb-modal-label">Admin Password</label>
                <input
                  id="lbp-pw"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPwError(""); }}
                  placeholder="Enter password"
                  autoFocus
                  className={`lb-modal-input ${pwError ? "lb-modal-input-error" : ""}`}
                  autoComplete="off"
                />
                {pwError && <p className="lb-modal-error">{pwError}</p>}
              </div>
              <div className="lb-modal-actions">
                <button type="button" onClick={onClose} className="lb-modal-cancel">Cancel</button>
                <button type="submit" className="lb-modal-confirm" disabled={resetting}>
                  {resetting ? "Resetting…" : "Reset All Scores"}
                </button>
              </div>
            </form>
            <button type="button" onClick={onClose} className="lb-modal-close" aria-label="Close">✕</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── LeaderboardPage ──────────────────────────────────────────────────────── */
export default function LeaderboardPage({ onBack, onHome, onLeaderboard }) {
  const [showReset,  setShowReset]  = useState(false);
  const [resetKey,   setResetKey]   = useState(0); // bump to force re-render after reset

  function handleReset() {
    setResetKey(k => k + 1);
  }

  return (
    <BrandLayout onHome={onHome} onLeaderboard={onLeaderboard}>
      <div className="flex flex-col items-center px-6 py-10 min-h-[calc(100vh-72px)]">
        <div className="w-full max-w-6xl space-y-8">

          {/* ── Page header ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <img
                  src="/AWS Student Builder Group_RGB_Icons_Trophy_Magenta.png"
                  alt="" aria-hidden="true"
                  className="h-8 w-8 object-contain"
                />
                <h1 className="text-3xl font-extrabold text-white">Leaderboard</h1>
              </div>
              <p className="text-[#8888aa] text-sm">
                Vignanotsava · AWS Typing Challenge · DBIT
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Reset button */}
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="btn-ghost px-4 py-2 text-sm"
                style={{ borderColor: "#f87171", color: "#f87171" }}
              >
                ↺ Reset Scores
              </button>

              {/* Back button */}
              <button
                type="button"
                onClick={onBack}
                className="btn-ghost px-5 py-2 text-sm"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* ── Two leaderboards side by side ───────────────────────────── */}
          <div key={resetKey} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RoleBoard
              role="student"
              title="Students"
              icon="🎓"
              accentColor="#e91e8c"
              accentGlow="rgba(233,30,140,0.2)"
            />
            <RoleBoard
              role="faculty"
              title="Faculty"
              icon="👨‍🏫"
              accentColor="#a78bfa"
              accentGlow="rgba(167,139,250,0.2)"
            />
          </div>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-center gap-3 opacity-40 pb-4">
            <img src="/AWS Student Builder Group_RGB_Brandmark_White.png" alt="AWS SBG" className="h-5 w-auto object-contain" />
            <span className="text-white text-xs">Student Builder Group · Don Bosco Institute of Technology</span>
          </div>

        </div>
      </div>

      {/* Reset modal */}
      {showReset && (
        <ResetModal onClose={() => setShowReset(false)} onReset={handleReset} />
      )}
    </BrandLayout>
  );
}
