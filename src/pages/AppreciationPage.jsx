/**
 * Route: /appreciation
 * Post-test thank-you + leadership sign-off.
 * Guards: redirects to / if no participant registered.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParticipant } from "../context/ParticipantContext";
import AppreciationScreen from "../components/AppreciationScreen";

export default function AppreciationPage() {
  const navigate = useNavigate();
  const { participant, resetParticipant } = useParticipant();

  useEffect(() => {
    if (!participant.name) navigate("/", { replace: true });
  }, [participant.name, navigate]);

  if (!participant.name) return null;

  return (
    <AppreciationScreen
      participant={participant}
      onContinue={() => navigate("/results")}
      ctaLabel="View My Results →"
      onHome={() => { resetParticipant(); navigate("/"); }}
      onLeaderboard={() => navigate("/leaderboard")}
    />
  );
}
