/**
 * Route: /connect
 * Standalone social media / QR codes page.
 * Can be visited directly — no registration guard.
 */
import { useNavigate } from "react-router-dom";
import { useParticipant } from "../context/ParticipantContext";
import BrandLayout from "../components/BrandLayout";
import QRSection from "../components/QRSection";

const SOCIALS = [
  {
    platform: "LinkedIn",
    handle: "AWS Student Builder Group DBIT",
    url: "https://www.linkedin.com/company/aws-student-builder-group-dbit",
    icon: "💼",
    color: "#0a66c2",
  },
  {
    platform: "WhatsApp Channel",
    handle: "Join our channel for updates",
    url: "#",
    icon: "💬",
    color: "#25d366",
  },
  {
    platform: "Meetup",
    handle: "AWS SBG DBIT Events",
    url: "https://www.meetup.com",
    icon: "📅",
    color: "#f65858",
  },
  {
    platform: "Community",
    handle: "AWS SBG DBIT",
    url: "#",
    icon: "🏛️",
    color: "#e91e8c",
  },
];

export default function SocialMediaPage() {
  const navigate = useNavigate();
  const { participant, resetParticipant } = useParticipant();

  return (
    <BrandLayout
      participantName={participant.name || ""}
      onHome={() => { resetParticipant(); navigate("/"); }}
      onLeaderboard={() => navigate("/leaderboard")}
    >
      <div className="flex flex-col items-center px-6 py-10 min-h-[calc(100vh-72px)]">
        <div className="w-full max-w-4xl space-y-8">

          {/* Page header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#e91e8c]/10 border border-[#e91e8c]/40 rounded-full px-4 py-1 mb-4">
              <span className="text-[#e91e8c] text-sm font-bold tracking-widest uppercase">📲 Stay Connected</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Community Handles</h1>
            <p className="text-[#8888aa] text-base max-w-xl mx-auto">
              Follow the AWS Student Builder Group at DBIT to stay updated with event schedules,
              speaker line-ups, and future cloud initiatives.
            </p>
          </div>

          {/* Social links grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SOCIALS.map(({ platform, handle, url, icon, color }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-card p-6 flex flex-col items-center text-center gap-3 no-underline transition-transform hover:-translate-y-1"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <span style={{ fontSize: "2.5rem" }}>{icon}</span>
                <div>
                  <p className="font-bold text-base" style={{ color }}>{platform}</p>
                  <p className="text-[#8888aa] text-sm mt-1">{handle}</p>
                </div>
                <span className="text-xs text-[#555570] border border-[#2e2e45] rounded-full px-3 py-1 mt-auto">
                  Follow →
                </span>
              </a>
            ))}
          </div>

          {/* QR codes */}
          <QRSection />

          {/* CTA back to registration */}
          <div className="text-center pb-4">
            <button
              onClick={() => navigate("/")}
              className="btn-pink btn-lg px-12"
            >
              🚀 Take the Typing Challenge
            </button>
          </div>

        </div>
      </div>
    </BrandLayout>
  );
}
