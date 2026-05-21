import { useState, useEffect, useRef } from "react";
import BrandLayout from "./BrandLayout";

function useTypewriter(text, speed = 18, onDone = null, enabled = true, skip = false) {
  const [displayed, setDisplayed] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    if (!enabled) { setDisplayed(text); return; }
    if (skip) {
      setDisplayed(text);
      if (!doneRef.current) { doneRef.current = true; onDone?.(); }
      return;
    }
    setDisplayed("");
    doneRef.current = false;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        if (!doneRef.current) { doneRef.current = true; onDone?.(); }
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, enabled, skip]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayed;
}

/**
 * AppreciationScreen
 * Shown after the typing test completes.
 * Typewriter appreciation message + leadership sign-off + CTA to view results.
 * Press any key to skip the animation and jump straight to the button.
 */
export default function AppreciationScreen({
  participant,
  onContinue,
  onHome,
  ctaLabel = "View My Results →",
}) {
  const [phase, setPhase] = useState(0);
  const [skip,  setSkip]  = useState(false);
  // phase 0 → appreciation typing
  // phase 1 → sign-off typing
  // phase 2 → CTA appears

  // Any keypress skips to the end
  useEffect(() => {
    function onKey() {
      setSkip(true);
      setPhase(2);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const appreciation =
    `Thank you, ${participant.name}, for participating in this activity hosted by the AWS Student Builder Group at Don Bosco Institute of Technology. ` +
    `Your enthusiasm and engagement inspire us to keep building a stronger, more vibrant cloud community at DBIT. ` +
    `We hope this challenge sparks your curiosity for cloud computing and opens doors to exciting opportunities ahead.`;

  const signoff =
    `With best wishes,\n– The Faculty Coordinator, Club Captain, and Core Team,\nAWS Student Builder Group, DBIT`;

  const appreciationText = useTypewriter(
    appreciation, 16,
    () => setTimeout(() => setPhase(1), 600),
    true,
    skip
  );
  const signoffText = useTypewriter(
    signoff, 20,
    () => setTimeout(() => setPhase(2), 500),
    phase >= 1,
    skip
  );

  return (
    <BrandLayout participantName={participant.name} onHome={onHome}>
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="brand-card brand-card-accent px-10 py-12">

            {/* Trophy icon with pink glow ring */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e91e8c]/10 border border-[#e91e8c]/30 shadow-[0_0_40px_rgba(233,30,140,0.2)]">
                <img
                  src="/AWS Student Builder Group_RGB_Icons_Trophy_Magenta.png"
                  alt="Trophy"
                  className="h-10 w-10 object-contain"
                />
              </div>
            </div>

            {/* Appreciation paragraph — typewriter */}
            <p className="text-[#ccccdd] text-lg leading-relaxed mb-8 min-h-[8rem]">
              {appreciationText}
              {phase === 0 && !skip && <span className="typewriter-cursor" />}
            </p>

            {/* Sign-off — typewriter, appears after appreciation */}
            {phase >= 1 && (
              <div className="border-t border-[#2e2e45] pt-6 mb-8 animate-fade-in">
                <p className="text-[#8888aa] text-sm leading-relaxed whitespace-pre-line italic">
                  {signoffText}
                  {phase === 1 && !skip && <span className="typewriter-cursor" />}
                </p>
              </div>
            )}

            {/* AWS + SBG logos — fade in with sign-off */}
            {phase >= 1 && (
              <div className="flex items-center justify-center gap-4 mb-8 opacity-60 animate-fade-in">
                <img src="/AWS_logo_RGB_WHT.png" alt="AWS" className="h-6 object-contain" />
                <img src="/AWS Student Builder Group_RGB_Brandmark_White.png" alt="AWS Student Builder Group" className="h-6 object-contain" />
              </div>
            )}

            {/* CTA — appears after sign-off finishes, or immediately on skip */}
            {phase >= 2 && (
              <div className="text-center animate-fade-in">
                <p className="text-[#8888aa] text-sm mb-4">Ready to see how you did?</p>
                <button onClick={onContinue} className="btn-pink btn-lg px-14">
                  {ctaLabel}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </BrandLayout>
  );
}
