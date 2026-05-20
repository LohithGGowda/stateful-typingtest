# Requirements — AWS Typing Challenge

**Project:** Vignanotsava AWS Typing Challenge
**Organisation:** AWS Student Builder Group, Don Bosco Institute of Technology (DBIT)
**Version:** 1.0.0

---

## 1. Overview

The AWS Typing Challenge is a browser-based, fully client-side typing speed competition designed to run as a live event activity. Participants register, complete a 60-second typing test using AWS-themed prompts, and are ranked on a live leaderboard. The application must require no backend infrastructure during the event and must reflect the official AWS Student Builder Group brand identity.

---

## 2. Functional Requirements

### 2.1 Participant Registration

| ID | Requirement |
|---|---|
| FR-01 | The system shall present a registration form before the typing test begins. |
| FR-02 | The participant shall select a role: **Student** or **Faculty**. |
| FR-03 | All participants shall provide a **Full Name** and **Department**. |
| FR-04 | Students shall provide a **USN** (University Seat Number) matching the pattern `1DB23CS121` (regex: `^[0-9][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}$`). |
| FR-05 | Faculty shall provide an **Employee ID** and select a **Designation** from a predefined list. |
| FR-06 | The form shall validate all required fields client-side and display inline error messages without a page reload. |
| FR-07 | USN and Employee ID inputs shall be auto-uppercased. |
| FR-08 | Department options shall differ between student and faculty roles. |

### 2.2 Onboarding Flow

| ID | Requirement |
|---|---|
| FR-09 | After registration, the system shall display a personalised greeting using a typewriter animation. |
| FR-10 | The greeting shall address the participant by name and acknowledge their role (student or faculty). |
| FR-11 | A social media hub shall be shown with QR codes for LinkedIn, WhatsApp Channel, Meetup, and the community page. |
| FR-12 | The participant shall be able to proceed to the typing test from the social hub. |

### 2.3 Typing Test

| ID | Requirement |
|---|---|
| FR-13 | The test shall present a randomly selected AWS-themed paragraph as the typing prompt. |
| FR-14 | The countdown timer shall start only when the participant types the first character. |
| FR-15 | The test duration shall be **60 seconds**. |
| FR-16 | Each character in the prompt shall be visually marked as **correct**, **incorrect**, or **untyped** in real time. |
| FR-17 | A cursor indicator shall highlight the current character position. |
| FR-18 | Live **WPM** (words per minute) and **Accuracy** (%) shall be displayed and updated continuously. |
| FR-19 | WPM shall be calculated as `(correct characters / 5) / elapsed minutes`. |
| FR-20 | Accuracy shall be calculated as `(correct characters / total typed characters) × 100`. |
| FR-21 | The test shall end automatically when the timer reaches zero. |
| FR-22 | The test shall also end if the participant completes the full prompt before time expires. |
| FR-23 | A **Reset** button shall allow the participant to restart with a new random paragraph. |
| FR-24 | The input area shall be disabled after the test ends. |
| FR-25 | The timer colour shall change to yellow below 20 seconds and red below 10 seconds. |

### 2.4 Appreciation Screen

| ID | Requirement |
|---|---|
| FR-26 | After the test ends, a thank-you message shall be displayed using a typewriter animation. |
| FR-27 | The message shall include a sign-off from the Faculty Coordinator, Club Captain, and Core Team. |
| FR-28 | A CTA button shall appear after the animation completes, navigating to the results screen. |

### 2.5 Results Screen

| ID | Requirement |
|---|---|
| FR-29 | The results screen shall display the participant's **final WPM** and **Accuracy**. |
| FR-30 | A **Typist Tier** badge shall be awarded based on WPM: Beginner (<40), Intermediate (40–59), Advanced (60–79), Expert (≥80). |
| FR-31 | The participant's name and USN/Employee ID shall be shown on the score card. |
| FR-32 | The full live leaderboard shall be displayed alongside the score card. |
| FR-33 | The current participant's row shall be highlighted in the leaderboard. |
| FR-34 | A **Next Participant** button shall reset the session and return to the registration screen. |

### 2.6 Leaderboard

| ID | Requirement |
|---|---|
| FR-35 | The leaderboard shall display all participants ranked by WPM in descending order. |
| FR-36 | The top three entries shall display medal icons (🥇 🥈 🥉). |
| FR-37 | The leaderboard shall auto-refresh every **3 seconds**. |
| FR-38 | Scores shall persist in `localStorage` across page refreshes on the same device. |
| FR-39 | An admin **Reset** button shall clear all scores after password verification. |
| FR-40 | The reset password shall be configurable in source code before deployment. |
| FR-41 | A standalone `/leaderboard` route shall display the full leaderboard. |

### 2.7 Navigation & Routing

| ID | Requirement |
|---|---|
| FR-42 | The application shall use client-side routing with the following paths: `/`, `/onboarding`, `/connect`, `/test`, `/appreciation`, `/results`, `/leaderboard`. |
| FR-43 | Navigating to an unknown path shall display a 404 page. |
| FR-44 | A **Home** button in the header shall be available on all screens to return to registration. |
| FR-45 | Participant data shall persist across route changes within the same browser tab using `sessionStorage`. |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement |
|---|---|
| NFR-01 | The application shall load and become interactive in under **3 seconds** on a standard broadband connection. |
| NFR-02 | The production build shall be optimised and code-split by Vite. |
| NFR-03 | The leaderboard poll interval shall not cause visible UI jank. |

### 3.2 Usability

| ID | Requirement |
|---|---|
| NFR-04 | The typing input shall receive focus automatically on the test screen. |
| NFR-05 | All interactive elements shall have visible focus indicators. |
| NFR-06 | Form error messages shall be descriptive and appear inline next to the relevant field. |
| NFR-07 | The application shall be usable on a laptop or desktop screen (minimum 1024 px wide) without horizontal scrolling. |
| NFR-08 | The application shall be responsive and usable on tablet-sized screens (≥ 768 px). |

### 3.3 Accessibility

| ID | Requirement |
|---|---|
| NFR-09 | All images shall include `alt` text; decorative images shall use `aria-hidden="true"`. |
| NFR-10 | Form inputs shall be associated with `<label>` elements via `htmlFor`/`id`. |
| NFR-11 | Interactive modal dialogs shall use `role="dialog"` and `aria-modal="true"`. |
| NFR-12 | Colour contrast shall meet WCAG 2.1 AA for all body text. |

### 3.4 Branding

| ID | Requirement |
|---|---|
| NFR-13 | The application shall use the official AWS Student Builder Group colour palette (primary: `#e91e8c` magenta, background: `#0d0d1a` dark navy). |
| NFR-14 | Official AWS SBG brand assets (logos, icons) shall be used as provided in the `/public` directory. |
| NFR-15 | The page title shall read "AWS Typing Challenge · DBIT Student Builder Group". |

### 3.5 Security & Data

| ID | Requirement |
|---|---|
| NFR-16 | No personally identifiable information (PII) shall be transmitted to any third-party service without explicit configuration. |
| NFR-17 | The leaderboard reset password shall not be exposed in the UI; it shall only be validated client-side. |
| NFR-18 | The application shall not store sensitive data (passwords, tokens) in `localStorage` or `sessionStorage`. |

### 3.6 Deployment

| ID | Requirement |
|---|---|
| NFR-19 | The production build shall consist entirely of static files deployable to any static hosting service. |
| NFR-20 | The application shall function correctly when served from a sub-path or root path. |
| NFR-21 | All client-side routes shall be handled by redirecting 404s to `index.html` on the host. |

---

## 4. Out of Scope (v1.0)

- Real-time multi-device leaderboard synchronisation (e.g., WebSockets, AWS AppSync)
- Persistent backend score storage (the `submitScoreToBackend` stub is a placeholder for a future API)
- User authentication or login
- Mobile (< 768 px) optimisation
- Internationalisation (i18n)
- Automated testing suite

---

## 5. Future Enhancements

| ID | Description |
|---|---|
| FE-01 | Integrate AWS API Gateway + DynamoDB to persist scores across devices |
| FE-02 | Add a real-time leaderboard using WebSockets or AWS AppSync subscriptions |
| FE-03 | Support multiple event modes (30 s, 60 s, 120 s) selectable at registration |
| FE-04 | Add a faculty-vs-student split view on the leaderboard |
| FE-05 | Export leaderboard results as CSV for post-event analysis |
| FE-06 | Add more AWS-themed paragraph prompts covering a wider range of services |
| FE-07 | Implement a practice mode that does not record scores |
