import { useState, useEffect, useRef } from "react";
import { getLeaderboard, clearLeaderboard } from "../utils/leaderboard";

const MEDALS     = ["🥇", "🥈", "🥉"];

/**
 * Leaderboard
 * Live-updating ranked table sorted by WPM descending.
 * Polls the backend API every 3 s so all devices stay in sync.
 *
 * Props:
 *   highlightUsn  — highlights the current participant's row
 *   compact       — shows top 5 only (welcome screen sidebar)
 */
export default function Leaderboard({ highlightUsn = "", compact = false }) {
  const [entries,      setEntries]      = useState([]);
  const [showModal,    setShowModal]    = useState(false);
  const [password,     setPassword]     = useState("");
  const [pwError,      setPwError]      = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetting,    setResetting]    = useState(false);

  const inputRef = useRef(null);

  // Refresh on mount and every 3 s
  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const data = await getLeaderboard();
      if (!cancelled) setEntries(data);
    }

    refresh();
    const id = setInterval(refresh, 3000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Focus password input when modal opens
  useEffect(() => {
    if (showModal) {
      setPassword("");
      setPwError("");
      setResetSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [showModal]);

  async function handleResetConfirm(e) {
    e.preventDefault();
    setResetting(true);
    const ok = await clearLeaderboard(password);
    setResetting(false);

    if (!ok) {
      setPwError("Incorrect password or server error. Try again.");
      setPassword("");
      inputRef.current?.focus();
      return;
    }

    setEntries([]);
    setResetSuccess(true);
    setTimeout(() => {
      setShowModal(false);
      setResetSuccess(false);
    }, 1800);
  }

  function handleModalClose() {
    setShowModal(false);
    setPassword("");
    setPwError("");
    setResetSuccess(false);
  }

  const visible = compact ? entries.slice(0, 5) : entries;

  return (
    <>
      {/* ── Leaderboard card ──────────────────────────────────────────────── */}
      <div className="leaderboard-wrap">

        {/* Header */}
        <div className="leaderboard-header">
          <div className="flex items-center gap-2">
            <img
              src="/AWS Student Builder Group_RGB_Icons_Trophy_Magenta.png"
              alt="" aria-hidden="true"
              className="h-5 w-5 object-contain"
            />
            <span className="leaderboard-title">Live Leaderboard</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="leaderboard-live-badge">
              <span className="leaderboard-live-dot" />
              LIVE
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="lb-reset-btn"
              title="Reset leaderboard (admin)"
              aria-label="Reset leaderboard"
            >
              ↺
            </button>
          </div>
        </div>

        {/* Table */}
        {visible.length === 0 ? (
          <div className="leaderboard-empty">
            <p>No scores yet — be the first!</p>
          </div>
        ) : (
          <div className="leaderboard-table-wrap">
            <div className="leaderboard-col-heads">
              <span className="lb-col-rank">#</span>
              <span className="lb-col-name">Participant</span>
              <span className="lb-col-usn">USN</span>
              <span className="lb-col-wpm">WPM</span>
              <span className="lb-col-acc">Accuracy</span>
            </div>

            {visible.map((entry, idx) => {
              const isMe = entry.usn.toLowerCase() === highlightUsn.toLowerCase();
              const rank = idx + 1;
              return (
                <div
                  key={entry.usn + idx}
                  className={`leaderboard-row ${isMe ? "leaderboard-row-me" : ""} ${rank <= 3 ? "leaderboard-row-top" : ""}`}
                >
                  <span className="lb-col-rank">
                    {rank <= 3
                      ? <span className="lb-medal">{MEDALS[rank - 1]}</span>
                      : <span className="lb-rank-num">{rank}</span>}
                  </span>
                  <span className="lb-col-name">
                    <span className="lb-name">{entry.name}</span>
                    {isMe && <span className="lb-you-badge">YOU</span>}
                  </span>
                  <span className="lb-col-usn lb-usn">{entry.usn}</span>
                  <span className="lb-col-wpm">
                    <span className={`lb-wpm ${rank === 1 ? "lb-wpm-gold" : ""}`}>{entry.wpm}</span>
                  </span>
                  <span className="lb-col-acc lb-acc">{entry.accuracy}%</span>
                </div>
              );
            })}
          </div>
        )}

        {compact && entries.length > 5 && (
          <p className="leaderboard-more">+{entries.length - 5} more participants</p>
        )}
      </div>

      {/* ── Reset modal ───────────────────────────────────────────────────── */}
      {showModal && (
        <div className="lb-modal-overlay" onClick={handleModalClose} role="dialog" aria-modal="true" aria-label="Reset leaderboard">
          <div className="lb-modal" onClick={e => e.stopPropagation()}>

            {resetSuccess ? (
              <div className="lb-modal-success">
                <span className="lb-modal-success-icon">✓</span>
                <p className="lb-modal-success-text">Leaderboard cleared!</p>
              </div>
            ) : (
              <>
                <div className="lb-modal-header">
                  <div className="lb-modal-icon-wrap">
                    <span className="lb-modal-icon">⚠️</span>
                  </div>
                  <h3 className="lb-modal-title">Reset Leaderboard</h3>
                  <p className="lb-modal-subtitle">
                    This will permanently delete all scores. Enter the admin password to continue.
                  </p>
                </div>

                <form onSubmit={handleResetConfirm} className="lb-modal-form">
                  <div>
                    <label htmlFor="lb-pw" className="lb-modal-label">Admin Password</label>
                    <input
                      id="lb-pw"
                      ref={inputRef}
                      type="password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setPwError(""); }}
                      placeholder="Enter password"
                      className={`lb-modal-input ${pwError ? "lb-modal-input-error" : ""}`}
                      autoComplete="off"
                    />
                    {pwError && <p className="lb-modal-error">{pwError}</p>}
                  </div>

                  <div className="lb-modal-actions">
                    <button type="button" onClick={handleModalClose} className="lb-modal-cancel">
                      Cancel
                    </button>
                    <button type="submit" className="lb-modal-confirm" disabled={resetting}>
                      {resetting ? "Resetting…" : "Reset All Scores"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {!resetSuccess && (
              <button
                type="button"
                onClick={handleModalClose}
                className="lb-modal-close"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
