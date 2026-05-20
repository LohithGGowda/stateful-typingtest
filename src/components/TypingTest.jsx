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
 * Stat cards use official AWS SBG icons from /public.
 */
export default function TypingTest({ participant, onFinish, onHome }) {
  const [paraIndex, setParaIndex] = useState(() => randomIndex());
  const [typed,     setTyped]     = useState("");
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_TIME);
  const [started,   setStarted]   = useState(false);
  const [finished,  setFinished]  = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

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

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleInput(e) {
    if (finished) return;
    const value = e.target.value;
    if (value.length > sourceText.length) return;
    if (!started && value.length > 0) { setStarted(true); startTimer(); }
    setTyped(value);

    if (value === sourceText) {
      stopTimer();
      setFinished(true);
      const fin = TOTAL_TIME - timeLeft;
      const finMin = fin / 60;
      onFinish({ wpm: finMin > 0 ? Math.round(value.length / 5 / finMin) : 0, accuracy: 100 });
    }
  }

  function handleReset() {
    stopTimer();
    setParaIndex(randomIndex(paraIndex));
    setTyped("");
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

          {/* ── Textarea input ────────────────────────────────────────────── */}
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            disabled={finished}
            aria-label="Typing input area"
            rows={5}
            className="brand-input font-mono resize-none disabled:opacity-40 disabled:cursor-not-allowed text-base py-4 px-5 leading-relaxed"
            placeholder="Click here and start typing…"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
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
          <div className="flex justify-end pb-4">
            <button onClick={handleReset} className="btn-ghost px-7 py-2.5 text-sm">
              ↺ Reset
            </button>
          </div>

        </div>
      </div>
    </BrandLayout>
  );
}
