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
    if (!participant.name || !scores.wpm) {
      navigate("/", { replace: true });
    }
  }, [participant.name, scores.wpm, navigate]);

  if (!participant.name || !scores.wpm) return null;

  function handleNextParticipant() {
    resetParticipant();
    navigate("/appreciation");
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
