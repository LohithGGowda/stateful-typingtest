import { useState, useEffect, useRef } from "react";
import BrandLayout from "./BrandLayout";

/* ─────────────────────────────────────────────────────────────────────────────
   Typewriter hook
   Renders `text` one character at a time at `speed` ms/char.
   Calls `onDone` when finished.
───────────────────────────────────────────────────────────────────────────── */
function useTypewriter(text, speed = 28, onDone = null, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    if (!enabled) { setDisplayed(text); return; }
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
  }, [text, speed, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayed;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Social handles data
───────────────────────────────────────────────────────────────────────────── */
const SOCIALS = [
  {
    platform: "LinkedIn",
    handle:   "AWS Student Builder Group DBIT",
    url:      "https://www.linkedin.com/company/aws-student-builder-group-dbit",
    qr:       "/qrcode_www.linkedin.com.png",
    icon:     "💼",
    color:    "#0a66c2",
    glow:     "rgba(10,102,194,0.3)",
  },
  {
    platform: "WhatsApp Channel",
    handle:   "Join our channel",
    url:      "#",
    qr:       "/WhatsApp_Channel.jpeg",
    icon:     "💬",
    color:    "#25d366",
    glow:     "rgba(37,211,102,0.3)",
  },
  {
    platform: "Meetup",
    handle:   "AWS SBG DBIT Events",
    url:      "https://www.meetup.com",
    qr:       "/qrcode_www.meetup.com.png",
    icon:     "📅",
    color:    "#f65858",
    glow:     "rgba(246,88,88,0.3)",
  },
  {
    platform: "Community",
    handle:   "AWS SBG DBIT",
    url:      "#",
    qr:       "/awssbg_dbit_qr.png",
    icon:     "🏛️",
    color:    "#e91e8c",
    glow:     "rgba(233,30,140,0.3)",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Step 2 — Personalized greeting + partnership branding
───────────────────────────────────────────────────────────────────────────── */
function StepGreeting({ participant, onNext, onHome }) {
  const [phase, setPhase] = useState(0);
  // phase 0 → greeting types, phase 1 → partnership types, phase 2 → button appears

  const greeting     = `Hi ${participant.name}! 👋`;
  const partnership  = participant.role === "faculty"
    ? `Welcome to Vignanotsava, ${participant.designation || "esteemed faculty"}! We're honoured to have you participate — this event is proudly powered by the AWS Student Builder Group, Don Bosco Institute of Technology.`
    : `Welcome to Vignanotsava — proudly powered by the AWS Student Builder Group, Don Bosco Institute of Technology.`;

  const greetingText    = useTypewriter(greeting,    30, () => setTimeout(() => setPhase(1), 400), phase >= 0);
  const partnershipText = useTypewriter(partnership, 22, () => setTimeout(() => setPhase(2), 500), phase >= 1);

  return (
    <BrandLayout participantName={participant.name} onHome={onHome}>
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="brand-card brand-card-accent px-10 py-12 text-center">

            {/* AWS SBG brandmark */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e91e8c]/10 border border-[#e91e8c]/30 shadow-[0_0_40px_rgba(233,30,140,0.2)]">
                <img
                  src="/AWS Student Builder Group_RGB_Brandmark_White.png"
                  alt="AWS SBG"
                  className="h-10 w-10 object-contain"
                />
              </div>
            </div>

            {/* Greeting */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 min-h-[3.5rem]">
              {greetingText}
              {phase === 0 && <span className="typewriter-cursor" />}
            </h1>

            {/* Partnership */}
            {phase >= 1 && (
              <p className="text-lg text-[#ccccdd] leading-relaxed mb-8 min-h-[5rem]">
                {partnershipText}
                {phase === 1 && <span className="typewriter-cursor" />}
              </p>
            )}

            {/* AWS logo + DBIT badge */}
            {phase >= 1 && (
              <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
                <img src="/AWS_logo_RGB_WHT.png" alt="AWS" className="h-8 object-contain opacity-90" />
                <span className="text-[#555570] text-xl">×</span>
                <div className="flex items-center gap-2">
                  <img src="/AWS Student Builder Group_RGB_Program Icon_White.png" alt="" aria-hidden="true" className="h-8 object-contain" />
                  <span className="text-white text-sm font-bold">Student Builder Group, DBIT</span>
                </div>
              </div>
            )}

            {/* CTA */}
            {phase >= 2 && (
              <button onClick={onNext} className="btn-pink btn-lg px-12 animate-fade-in">
                Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    </BrandLayout>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Step 3 — Social media hub
───────────────────────────────────────────────────────────────────────────── */
function StepSocials({ participant, onNext, onHome }) {
  const [cardsVisible, setCardsVisible] = useState(false);
  const [btnVisible,   setBtnVisible]   = useState(false);

  const introText = `To stay updated with event schedules, speaker line-ups, and future cloud initiatives — follow our official community handles!`;
  const intro = useTypewriter(introText, 20, () => {
    setTimeout(() => setCardsVisible(true), 300);
    setTimeout(() => setBtnVisible(true), 1200);
  });

  return (
    <BrandLayout participantName={participant.name} onHome={onHome}>
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] px-6 py-10">
        <div className="w-full max-w-3xl">
          <div className="brand-card brand-card-accent px-10 py-10">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📲</span>
              <h2 className="text-2xl font-bold text-white">Stay Connected</h2>
            </div>

            {/* Intro typewriter */}
            <p className="text-[#ccccdd] text-lg leading-relaxed mb-8 min-h-[4rem]">
              {intro}
              {!cardsVisible && <span className="typewriter-cursor" />}
            </p>

            {/* Social cards grid */}
            {cardsVisible && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in">
                {SOCIALS.map(({ platform, handle, qr, icon, color, glow }) => (
                  <div
                    key={platform}
                    className="social-card"
                    style={{ "--sc-color": color, "--sc-glow": glow }}
                  >
                    <div className="sc-bar" style={{ backgroundColor: color }} />
                    <div className="sc-icon-badge" style={{ borderColor: color, color }}>
                      {icon}
                    </div>
                    <div className="sc-qr-wrap" style={{ boxShadow: `0 0 16px ${glow}` }}>
                      <img src={qr} alt={`${platform} QR`} className="sc-qr-img" />
                    </div>
                    <p className="sc-label" style={{ color }}>{platform}</p>
                    <p className="sc-handle">{handle}</p>
                    <div className="sc-scan">
                      <span className="sc-dot" style={{ backgroundColor: color }} />
                      Scan to follow
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {btnVisible && (
              <div className="flex justify-end animate-fade-in">
                <button onClick={onNext} className="btn-pink btn-lg px-10">
                  🚀 Start the Typing Test
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </BrandLayout>
  );
}

export default function OnboardingFlow({ participant, onStartTest, onHome }) {
  const [step, setStep] = useState(2);

  return (
    <>
      {step === 2 && (
        <StepGreeting participant={participant} onNext={() => setStep(3)} onHome={onHome} />
      )}
      {step === 3 && (
        <StepSocials participant={participant} onNext={onStartTest} onHome={onHome} />
      )}
    </>
  );
}
