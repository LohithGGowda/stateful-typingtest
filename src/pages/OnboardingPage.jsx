/**
 * Route: /onboarding
 * Personalized greeting → social media hub → Start Test.
 * Guards: redirects to / if no participant registered.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParticipant } from "../context/ParticipantContext";
import OnboardingFlow from "../components/OnboardingFlow";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { participant, resetParticipant } = useParticipant();

  // Guard — must have registered first
  useEffect(() => {
    if (!participant.name) navigate("/", { replace: true });
  }, [participant.name, navigate]);

  if (!participant.name) return null;

  return (
    <OnboardingFlow
      participant={participant}
      onStartTest={() => navigate("/test")}
      onHome={() => { resetParticipant(); navigate("/"); }}
      onLeaderboard={() => navigate("/leaderboard")}
    />
  );
}
