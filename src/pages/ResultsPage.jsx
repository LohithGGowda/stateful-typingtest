/**
 * Route: /results
 * Final score card + live leaderboard.
 * Guards: redirects to / if no participant registered.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParticipant } from "../context/ParticipantContext";
import ResultsScreen from "../components/ResultsScreen";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { participant, scores, resetParticipant } = useParticipant();

  useEffect(() => {
    if (!participant.name) navigate("/", { replace: true });
  }, [participant.name, navigate]);

  if (!participant.name) return null;

  function handleNextParticipant() {
    resetParticipant();
    navigate("/");
  }

  return (
    <ResultsScreen
      participant={participant}
      wpm={scores.wpm}
      accuracy={scores.accuracy}
      onTryAgain={handleNextParticipant}
      onHome={() => { resetParticipant(); navigate("/"); }}
      onLeaderboard={() => navigate("/leaderboard")}
    />
  );
}
