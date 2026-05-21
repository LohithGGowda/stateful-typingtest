import { useState, useEffect, useRef, useCallback } from "react";
import paragraphs from "../data/paragraphs";
import BrandLayout from "./BrandLayout";

const TOTAL_TIME = 60;

function randomIndex(exclude = -1) {
  let idx;
  do { idx = Math.floor(Math.random() * paragraphs.length); }
  while (paragraphs.length > 1 && idx === exclude);
  return idx;
}

/**
 * TypingTest
 * Core 60-second typing interface.
 *
 * Input strategy: a visually-hidden <input> captures keystrokes only.
 * All text is built character-by-character from keydown events, so
 * paste / drag-and-drop / reader-mode injection is structurally impossible —
 * there is no editable field for the browser to inject text into.
 */
export default function TypingTest({ participant, onFinish, onHome }) {
  const [paraIndex, setParaIndex] = useState(() => randomIndex());
  const [typed,     setTyped]     = useState("");
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_TIME);
  const [started,   setStarted]   = useState(false);
  const [finished,  setFinished]  = useState(false);
  const [focused,   setFocused]   = useState(false);

  const inputRef  = useRef(null);
  const timerRef  = useRef(null);
  // Keep a ref so keydown handler always sees the latest typed value
  const typedRef  = useRef("");

  const sourceText = paragraphs[paraIndex];

  // ── Derived stats ──────────────────────────────────────────────────────────
  const correctChars = typed.split("").filter((ch, i) => ch === sourceText[i]).length;
  const elapsed      = TOTAL_TIME - timeLeft;
  const minutes      = elapsed / 60;
  const liveWPM      = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
  const liveAccuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;

  // ── Timer ──────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && started && !finished) {
      stopTimer();
      setFinished(true);
      onFinish({ wpm: liveWPM, accuracy: liveAccuracy });
    }
  }, [timeLeft, started, finished, liveWPM, liveAccuracy, stopTimer, onFinish]);

  useEffect(() => () => stopTimer(), [stopTimer]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  // ── Keystroke handler — the ONLY way text enters the typed state ───────────
  const handleKeyDown = useCallback((e) => {
    if (finished) return;

    // Block all modifier-key combos (Ctrl/Cmd/Alt shortcuts)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      e.preventDefault();
      return;
    }

    const current = typedRef.current;

    if (e.key === "Backspace") {
      e.preventDefault();
      const next = current.slice(0, -1);
      typedRef.current = next;
      setTyped(next);
      return;
    }

    // Only accept single printable characters
    if (e.key.length !== 1) return;
    if (current.length >= sourceText.length) return;

    e.preventDefault();

    const next = current + e.key;
    typedRef.current = next;

    if (!started) {
      setStarted(true);
      startTimer();
    }

    setTyped(next);

    if (next.length >= sourceText.length) {
      stopTimer();
      setFinished(true);
      const fin = TOTAL_TIME - timeLeft;
      const finMin = fin / 60;
      const correctCount = next.split("").filter((ch, i) => ch === sourceText[i]).length;
      const acc = Math.round((correctCount / next.length) * 100);
      onFinish({ wpm: finMin > 0 ? Math.round(correctCount / 5 / finMin) : 0, accuracy: acc });
    }
  }, [finished, started, sourceText, timeLeft, startTimer, stopTimer, onFinish]);

  function handleReset() {
    stopTimer();
    const next = randomIndex(paraIndex);
    setParaIndex(next);
    setTyped("");
    typedRef.current = "";
    setTimeLeft(TOTAL_TIME);
    setStarted(false);
    setFinished(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  // ── Character rendering ────────────────────────────────────────────────────
  function renderText() {
    return sourceText.split("").map((char, i) => {
      let cls = "char-untyped";
      if (i < typed.length) {
        cls = typed[i] === char ? "char-correct" : "char-incorrect";
      }
      const isCursor = i === typed.length;
      return (
        <span
          key={i}
          className={`${cls}${isCursor ? " char-cursor" : ""} font-mono text-xl leading-loose`}
        >
          {char}
        </span>
      );
    });
  }

  // ── Typed text display (mirrors what the user has typed so far) ────────────
  function renderTyped() {
    if (typed.length === 0) return null;
    return typed.split("").map((ch, i) => {
      const correct = ch === sourceText[i];
      return (
        <span
          key={i}
          className={`font-mono text-base ${correct ? "text-green-400" : "text-red-400"}`}
        >
          {ch}
        </span>
      );
    });
  }

  // ── Timer colour ──────────────────────────────────────────────────────────
  const timerCls =
    timeLeft > 20 ? "text-[#e91e8c]" :
    timeLeft > 10 ? "text-yellow-400" :
                    "text-red-400";

  const progressPct = Math.min((typed.length / sourceText.length) * 100, 100);
  const timePct     = (timeLeft / TOTAL_TIME) * 100;

  return (
    <BrandLayout participantName={participant.name} onHome={onHome}>
      <div className="flex flex-col items-center px-6 py-8 min-h-[calc(100vh-72px)]">
        <div className="w-full max-w-5xl space-y-6">

          {/* ── Stats row ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-5">

            {/* Timer — Clock icon */}
            <div className="stat-card py-5 px-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img
                  src="/AWS Student Builder Group_RGB_Icons_Clock_Magenta.png"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 object-contain"
                />
                <p className="text-[#8888aa] text-sm uppercase tracking-widest font-medium">Time</p>
              </div>
              <p className={`text-5xl font-bold tabular-nums ${timerCls}`}>
                {timeLeft}
                <span className="text-xl font-normal text-[#555570] ml-1">s</span>
              </p>
              <div className="progress-track mt-3">
                <div
                  className="progress-fill"
                  style={{
                    width: `${timePct}%`,
                    backgroundColor: timeLeft > 10 ? "#e91e8c" : "#f87171",
                  }}
                />
              </div>
            </div>

            {/* WPM — Bolt icon */}
            <div className="stat-card py-5 px-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img
                  src="/AWS Student Builder Group_RGB_Icons_Bolt_Magenta.png"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 object-contain"
                />
                <p className="text-[#8888aa] text-sm uppercase tracking-widest font-medium">WPM</p>
              </div>
              <p className="text-5xl font-bold tabular-nums text-white">{liveWPM}</p>
              <p className="text-[#555570] text-sm mt-2">words / minute</p>
            </div>

            {/* Accuracy — Key icon */}
            <div className="stat-card py-5 px-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img
                  src="/AWS Student Builder Group_RGB_Icons_Key_Magenta.png"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 object-contain"
                />
                <p className="text-[#8888aa] text-sm uppercase tracking-widest font-medium">Accuracy</p>
              </div>
              <p className="text-5xl font-bold tabular-nums text-white">
                {liveAccuracy}
                <span className="text-2xl font-normal text-[#555570]">%</span>
              </p>
              <p className="text-[#555570] text-sm mt-2">character accuracy</p>
            </div>
          </div>

          {/* ── Text display panel ────────────────────────────────────────── */}
          <div
            className="brand-card brand-card-accent px-8 py-7 cursor-text select-none"
            onClick={() => inputRef.current?.focus()}
            aria-label="Typing text display"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block bg-[#e91e8c]/15 border border-[#e91e8c]/30 text-[#e91e8c] text-sm px-3 py-1 rounded font-mono font-medium">
                AWS Prompt #{paraIndex + 1}
              </span>
              {!started && (
                <span className="text-[#555570] text-sm italic">
                  Start typing to begin the countdown…
                </span>
              )}
            </div>
            <p className="leading-loose break-words text-xl">{renderText()}</p>
          </div>

          {/* ── Typing area (click to focus, keystroke-only input) ────────── */}
          <div
            role="textbox"
            aria-label="Typing input area"
            aria-multiline="true"
            tabIndex={0}
            onClick={() => inputRef.current?.focus()}
            onFocus={() => { setFocused(true); inputRef.current?.focus(); }}
            className={`brand-input font-mono text-base py-4 px-5 leading-relaxed min-h-[7rem] cursor-text select-none
              ${finished ? "opacity-40 cursor-not-allowed" : ""}
              ${focused ? "ring-2 ring-[#e91e8c]/50" : ""}
            `}
          >
            {typed.length === 0 ? (
              <span className="text-[#555570] italic">Click here and start typing…</span>
            ) : (
              <span className="break-all">{renderTyped()}</span>
            )}
          </div>

          {/* Hidden input — captures keystrokes, invisible to browser injection */}
          <input
            ref={inputRef}
            type="text"
            readOnly
            value=""
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-hidden="true"
            tabIndex={-1}
            style={{
              position: "absolute",
              opacity: 0,
              pointerEvents: "none",
              width: 0,
              height: 0,
              overflow: "hidden",
            }}
          />

          {/* ── Character progress bar ────────────────────────────────────── */}
          <div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-[#555570]">
                {typed.length} / {sourceText.length} chars
              </span>
              <span className="text-sm text-[#555570]">
                {Math.round(progressPct)}% complete
              </span>
            </div>
          </div>

          {/* ── Control panel ─────────────────────────────────────────────── */}
          <div className="flex justify-between pb-4">
            <button
              onClick={() => {
                if (!started || finished || window.confirm("Quit the test? Your progress will be lost.")) {
                  stopTimer();
                  onHome();
                }
              }}
              className="btn-ghost px-7 py-2.5 text-sm text-red-400 hover:text-red-300"
            >
              ✕ Quit
            </button>
            <button onClick={handleReset} className="btn-ghost px-7 py-2.5 text-sm">
              ↺ Reset
            </button>
          </div>

        </div>
      </div>
    </BrandLayout>
  );
}
