# AWS Typing Challenge — Vignanotsava

A live, branded typing-speed competition web app built for the **AWS Student Builder Group, Don Bosco Institute of Technology (DBIT)**. Participants register, complete a 60-second typing test, and see their WPM and accuracy on a live leaderboard — all without a backend.

---

## Features

- **Participant registration** — separate flows for students (USN) and faculty (Employee ID + designation), with client-side validation
- **60-second typing test** — real-time WPM and accuracy tracking with character-level colour feedback
- **Onboarding flow** — personalised typewriter greeting and social media hub with QR codes
- **Appreciation screen** — animated sign-off message from the AWS SBG core team
- **Live leaderboard** — localStorage-backed, auto-refreshes every 3 seconds, supports top-3 medals and a "YOU" highlight
- **Admin reset** — password-protected leaderboard clear (default password: `RCB`)
- **AWS SBG branding** — official magenta/dark theme using AWS Student Builder Group assets
- **Fully client-side** — no server required; scores persist in `localStorage` for the duration of the event

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Build tool | Vite 8 |
| Linting | ESLint 10 |
| State | React Context + `sessionStorage` |
| Persistence | `localStorage` (leaderboard) |

---

## Project Structure

```
src/
├── App.jsx                    # Route definitions
├── main.jsx                   # React entry point
├── index.css                  # Global styles & design tokens
├── components/
│   ├── BrandLayout.jsx        # Shared header/nav wrapper
│   ├── WelcomeScreen.jsx      # Registration form (Step 1)
│   ├── OnboardingFlow.jsx     # Greeting + social hub (Steps 2–3)
│   ├── TypingTest.jsx         # Core 60-second test
│   ├── AppreciationScreen.jsx # Post-test thank-you
│   ├── ResultsScreen.jsx      # Score card + leaderboard
│   ├── Leaderboard.jsx        # Reusable leaderboard component
│   ├── LeaderboardPage.jsx    # Full leaderboard view
│   └── QRSection.jsx          # QR code display helper
├── context/
│   └── ParticipantContext.jsx # Global participant + score state
├── data/
│   └── paragraphs.js          # AWS-themed typing prompts
├── pages/                     # Route-level page wrappers
└── utils/
    └── leaderboard.js         # localStorage read/write helpers
public/
├── favicon.svg
├── AWS_logo_RGB_WHT.png
├── AWS Student Builder Group_RGB_*.png   # Official brand assets
└── *.png / *.jpeg             # QR codes and event images
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9 (or yarn / pnpm)

### Install & run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is written to `dist/`. Serve it with any static host (S3 + CloudFront, Netlify, Vercel, GitHub Pages, etc.).

```bash
# Preview the production build locally
npm run preview
```

---

## Route Map

| Path | Description |
|---|---|
| `/` | Registration / Welcome screen |
| `/onboarding` | Personalised greeting + social media hub |
| `/connect` | Standalone social handles page |
| `/test` | 60-second typing challenge |
| `/appreciation` | Post-test thank-you screen |
| `/results` | Score card + live leaderboard |
| `/leaderboard` | Full leaderboard (Students vs Faculty) |

---

## Leaderboard

Scores are stored in `localStorage` under the key `leaderboard`. They persist across page refreshes for the lifetime of the browser session on that device — ideal for a single-device event kiosk setup.

To reset all scores, click the **↺** button on any leaderboard and enter the admin password.

> The default admin password is `RCB`. Change `RESET_PASS` in `src/components/Leaderboard.jsx` before deploying.

---

## Customisation

| What | Where |
|---|---|
| Typing prompts | `src/data/paragraphs.js` |
| Test duration | `TOTAL_TIME` constant in `src/components/TypingTest.jsx` |
| Admin password | `RESET_PASS` constant in `src/components/Leaderboard.jsx` |
| Social handles / QR codes | `SOCIALS` array in `src/components/OnboardingFlow.jsx` |
| Brand colours | CSS variables in `src/index.css` |
| Backend score submission | `submitScoreToBackend()` in `src/components/ResultsScreen.jsx` |

---

## Deployment

The app is a fully static SPA. Any static host works:

```bash
npm run build
# then upload dist/ to your host of choice
```

For AWS hosting, a recommended setup is **S3 + CloudFront** with a single-page app redirect rule (all 404s → `index.html`).

---

## License

See [LICENSE](./LICENSE).

---

*Built with ❤️ by the AWS Student Builder Group, Don Bosco Institute of Technology.*
