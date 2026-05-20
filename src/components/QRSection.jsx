/**
 * QRSection
 * Branded QR code strip shown on the Welcome screen.
 * Three cards: AWS SBG DBIT community, LinkedIn, and Meetup.
 */

const QR_CARDS = [
  {
    img:     "/awssbg_dbit_qr.png",
    label:   "AWS SBG DBIT",
    sub:     "Join our community",
    icon:    "🏛️",
    accent:  "#e91e8c",
    glow:    "rgba(233,30,140,0.25)",
  },
  {
    img:     "/WhatsApp_Channel.jpeg",
    label:   "WhatsApp Channel",
    sub:     "Get updates instantly",
    icon:    "💬",
    accent:  "#25d366",          // WhatsApp green
    glow:    "rgba(37,211,102,0.25)",
  },
  {
    img:     "/qrcode_www.linkedin.com.png",
    label:   "LinkedIn",
    sub:     "Connect with us",
    icon:    "💼",
    accent:  "#0a66c2",
    glow:    "rgba(10,102,194,0.25)",
  },
  {
    img:     "/qrcode_www.meetup.com.png",
    label:   "Meetup",
    sub:     "RSVP to events",
    icon:    "📅",
    accent:  "#f65858",
    glow:    "rgba(246,88,88,0.25)",
  },
];

export default function QRSection() {
  return (
    <section className="w-full max-w-3xl mx-auto mt-8 mb-2" aria-label="Community QR codes">

      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-[#2e2e45]" />
        <p className="text-[#8888aa] text-sm font-semibold uppercase tracking-widest whitespace-nowrap px-2">
          📲 Scan &amp; Connect
        </p>
        <div className="flex-1 h-px bg-[#2e2e45]" />
      </div>

      {/* QR cards grid */}
      <div className="grid grid-cols-4 gap-4">
        {QR_CARDS.map(({ img, label, sub, icon, accent, glow }) => (
          <div
            key={label}
            className="qr-card group"
            style={{ "--qr-accent": accent, "--qr-glow": glow }}
          >
            {/* Top accent line */}
            <div className="qr-card-bar" style={{ backgroundColor: accent }} />

            {/* Icon badge */}
            <div className="qr-icon-badge" style={{ borderColor: accent, color: accent }}>
              <span>{icon}</span>
            </div>

            {/* QR image */}
            <div className="qr-img-wrap" style={{ boxShadow: `0 0 20px ${glow}` }}>
              <img
                src={img}
                alt={`QR code for ${label}`}
                className="qr-img"
              />
            </div>

            {/* Label */}
            <p className="qr-label" style={{ color: accent }}>{label}</p>
            <p className="qr-sub">{sub}</p>

            {/* Scan prompt */}
            <div className="qr-scan-prompt">
              <span className="qr-scan-dot" style={{ backgroundColor: accent }} />
              Scan to join
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
