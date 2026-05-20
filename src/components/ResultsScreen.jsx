import { useEffect } from "react";
import BrandLayout  from "./BrandLayout";
import Leaderboard  from "./Leaderboard";
import { saveScore } from "../utils/leaderboard";

function getTier(wpm) {
  if (wpm >= 80) return { label: "Expert",       color: "text-[#e91e8c]",  border: "border-[#e91e8c]" };
  if (wpm >= 60) return { label: "Advanced",     color: "text-green-400",  border: "border-green-400" };
  if (wpm >= 40) return { label: "Intermediate", color: "text-blue-400",   border: "border-blue-400"  };
  return           { label: "Beginner",      color: "text-[#8888aa]", border: "border-[#8888aa]" };
}

export default function ResultsScreen({ participant, wpm, accuracy, onTryAgain, onHome }) {
  const tier = getTier(wpm);

  useEffect(() => {
    saveScore({
      name:        participant.name,
      usn:         participant.usn,
      role:        participant.role,
      department:  participant.department,
      designation: participant.designation ?? "",
      wpm,
      accuracy,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrandLayout participantName={participant.name} onHome={onHome}>
      <div className="flex items-start justify-center min-h-[calc(100vh-72px)] px-6 py-10">
        <div className="w-full max-w-5xl">

          {/* ── Two-column: score card left, full leaderboard right ──────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">

            {/* ── LEFT: Score card ──────────────────────────────────────── */}
            <div className="brand-card brand-card-accent px-8 py-10">

              {/* Trophy banner */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e91e8c]/10 border border-[#e91e8c]/30 mb-4 shadow-[0_0_32px_rgba(233,30,140,0.2)]">
                  <img
                    src="/AWS Student Builder Group_RGB_Icons_Trophy_Magenta.png"
                    alt="Trophy"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  Challenge Completed!
                </h1>
                <p className="text-[#8888aa] text-sm">
                  Great effort,{" "}
                  <span className="text-white font-semibold">{participant.name}</span>!
                </p>
              </div>

              {/* Tier badge */}
              <div className="flex justify-center mb-6">
                <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full ${tier.border}`}>
                  <img
                    src="/AWS Student Builder Group_RGB_Icons_Ladder_Magenta.png"
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                  />
                  <span className={`text-xs font-bold tracking-widest uppercase ${tier.color}`}>
                    {tier.label} Typist
                  </span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="stat-card py-6">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <img src="/AWS Student Builder Group_RGB_Icons_Bolt_Magenta.png" alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
                    <p className="text-[#8888aa] text-xs uppercase tracking-widest">Final WPM</p>
                  </div>
                  <p className="text-5xl font-extrabold text-[#e91e8c] tabular-nums">{wpm}</p>
                  <p className="text-[#555570] text-xs mt-1">words / minute</p>
                </div>
                <div className="stat-card py-6">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <img src="/AWS Student Builder Group_RGB_Icons_Key_Magenta.png" alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
                    <p className="text-[#8888aa] text-xs uppercase tracking-widest">Accuracy</p>
                  </div>
                  <p className="text-5xl font-extrabold text-white tabular-nums">
                    {accuracy}<span className="text-2xl font-bold text-[#555570]">%</span>
                  </p>
                  <p className="text-[#555570] text-xs mt-1">character accuracy</p>
                </div>
              </div>

              {/* Participant strip */}
              <div className="flex items-center gap-3 bg-[#1a1a28] border border-[#2e2e45] rounded-md px-4 py-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#e91e8c]/10 border border-[#e91e8c]/20 flex items-center justify-center flex-shrink-0">
                  <img src="/AWS Student Builder Group_RGB_Icons_Teams_Magenta.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold truncate">{participant.name}</p>
                  <p className="text-[#8888aa] text-xs font-mono truncate">{participant.usn}</p>
                </div>
                <div className="flex-shrink-0 bg-[#e91e8c]/10 border border-[#e91e8c]/30 rounded px-2.5 py-1">
                  <span className="text-[#e91e8c] text-xs font-bold">{wpm} WPM</span>
                </div>
              </div>

              {/* ── Next Participant CTA ──────────────────────────────── */}
              <div className="mt-6 space-y-3">
                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#2e2e45]" />
                  <span className="text-[#555570] text-xs uppercase tracking-widest font-semibold whitespace-nowrap">
                    Next up?
                  </span>
                  <div className="flex-1 h-px bg-[#2e2e45]" />
                </div>

                {/* Next Participant button — full width, prominent */}
                <button
                  onClick={onTryAgain}
                  className="btn-pink btn-lg w-full"
                >
                  👤 Next Participant
                </button>

                <p className="text-center text-xs text-[#555570]">
                  Hand the device to the next participant to register and play.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
                <img src="/AWS Student Builder Group_RGB_Brandmark_White.png" alt="AWS Student Builder Group" className="h-4 w-auto object-contain" />
                <span className="text-white text-xs">Student Builder Group · Don Bosco Institute of Technology</span>
              </div>
            </div>

            {/* ── RIGHT: Full leaderboard ────────────────────────────────── */}
            <div className="lg:sticky lg:top-6">
              <Leaderboard highlightUsn={participant.usn} />
            </div>
          </div>

        </div>
      </div>
    </BrandLayout>
  );
}
