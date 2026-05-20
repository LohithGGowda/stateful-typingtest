import { Routes, Route } from "react-router-dom";
import HomePage              from "./pages/HomePage";
import OnboardingPage        from "./pages/OnboardingPage";
import SocialMediaPage       from "./pages/SocialMediaPage";
import TestPage              from "./pages/TestPage";
import AppreciationPage      from "./pages/AppreciationPage";
import ResultsPage           from "./pages/ResultsPage";
import LeaderboardPageRoute  from "./pages/LeaderboardPageRoute";
import NotFoundPage          from "./pages/NotFoundPage";

/**
 * Route map:
 *   /              → Registration / Welcome
 *   /onboarding    → Personalized greeting + social hub
 *   /connect       → Standalone social media handles page
 *   /test          → 60-second typing challenge
 *   /appreciation  → Post-test thank-you + sign-off
 *   /results       → Score card + leaderboard
 *   /leaderboard   → Full leaderboard (Students vs Faculty)
 *   *              → 404
 */
export default function App() {
  return (
    <Routes>
      <Route path="/"             element={<HomePage />} />
      <Route path="/onboarding"   element={<OnboardingPage />} />
      <Route path="/connect"      element={<SocialMediaPage />} />
      <Route path="/test"         element={<TestPage />} />
      <Route path="/appreciation" element={<AppreciationPage />} />
      <Route path="/results"      element={<ResultsPage />} />
      <Route path="/leaderboard"  element={<LeaderboardPageRoute />} />
      <Route path="*"             element={<NotFoundPage />} />
    </Routes>
  );
}
