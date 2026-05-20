import { useNavigate } from "react-router-dom";

/**
 * BrandLayout — shared shell for every screen.
 *
 * Props:
 *   participantName — shown in the navbar right slot when provided
 *   onHome          — AWS logo click → /
 *   onLeaderboard   — 🏆 button → /leaderboard
 */
export default function BrandLayout({ children, participantName, onHome, onLeaderboard }) {
  const navigate = useNavigate();

  return (
    <div className="brand-bg">
      {/* Corner accent blocks */}
      <div className="corner-tl" aria-hidden="true" />
      <div className="corner-tr" aria-hidden="true" />
      <div className="corner-bl" aria-hidden="true" />
      <div className="corner-br" aria-hidden="true" />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="brand-navbar">

        {/* Left: AWS logo → home + nav buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* AWS logo — home */}
          <button
            type="button"
            onClick={onHome ?? (() => navigate("/"))}
            className="navbar-home-btn"
            aria-label="Go to home"
            title="Go to home"
          >
            <img
              src="/AWS_logo_RGB_WHT.png"
              alt="Amazon Web Services — Home"
              className="h-9 w-auto object-contain"
            />
          </button>

          {/* Leaderboard button */}
          <button
            type="button"
            onClick={onLeaderboard ?? (() => navigate("/leaderboard"))}
            className="navbar-lb-btn"
            aria-label="View leaderboard"
          >
            <span className="navbar-lb-icon">🏆</span>
            <span className="navbar-lb-label">Leaderboard</span>
          </button>

          {/* Connect / Social button */}
          <button
            type="button"
            onClick={() => navigate("/connect")}
            className="navbar-lb-btn"
            aria-label="Community handles"
            style={{ "--lb-color": "#25d366" }}
          >
            <span className="navbar-lb-icon">📲</span>
            <span className="navbar-lb-label" style={{ color: "#25d366" }}>Connect</span>
          </button>
        </div>

        {/* Centre: SBG Program Icon + event title */}
        <div className="flex items-center gap-3 flex-1 justify-center min-w-0 px-4">
          <img
            src="/AWS Student Builder Group_RGB_Program Icon_White.png"
            alt=""
            aria-hidden="true"
            className="h-9 w-auto object-contain flex-shrink-0"
          />
          <div className="text-center hidden sm:block min-w-0">
            <p className="text-white text-sm font-bold leading-tight whitespace-nowrap tracking-wide">
              AWS Student Builder Group
            </p>
            <p className="text-[#e91e8c] text-sm font-semibold leading-tight whitespace-nowrap">
              at Don Bosco Institute of Technology
            </p>
          </div>
          <p className="text-white text-sm font-bold sm:hidden whitespace-nowrap">
            AWS SBG · DBIT
          </p>
        </div>

        {/* Right: participant name or SBG brandmark */}
        <div className="flex-shrink-0 w-[160px] flex justify-end items-center">
          {participantName ? (
            <span className="text-[#8888aa] text-sm truncate block font-medium">
              {participantName}
            </span>
          ) : (
            <img
              src="/AWS Student Builder Group_RGB_Brandmark_White.png"
              alt="AWS Student Builder Group"
              className="w-auto object-contain ml-auto"
              style={{ height: "52px", marginTop: "-8px", marginBottom: "-8px" }}
            />
          )}
        </div>
      </nav>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
