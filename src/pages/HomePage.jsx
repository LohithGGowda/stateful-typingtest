/**
 * Route: /
 * The registration / welcome page.
 * Re-exports WelcomeScreen wired to the router.
 */
import { useNavigate } from "react-router-dom";
import { useParticipant } from "../context/ParticipantContext";
import WelcomeScreen from "../components/WelcomeScreen";

export default function HomePage() {
  const navigate = useNavigate();
  const { setParticipant, resetParticipant } = useParticipant();

  function handleStart(details) {
    setParticipant(details);
    navigate("/onboarding");
  }

  return (
    <WelcomeScreen
      onStart={handleStart}
      onHome={() => { resetParticipant(); navigate("/"); }}
      onLeaderboard={() => navigate("/leaderboard")}
    />
  );
}
