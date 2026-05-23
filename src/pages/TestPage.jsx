/**
 * Route: /test
 * The 60-second typing challenge.
 * Guards: redirects to / if no participant registered.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParticipant } from "../context/ParticipantContext";
import TypingTest from "../components/TypingTest";

export default function TestPage() {
  const navigate = useNavigate();
  const { participant, setScores, resetParticipant } = useParticipant();

  // Guard — must have registered first
  useEffect(() => {
    if (!participant.name) navigate("/", { replace: true });
  }, [participant.name, navigate]);

  if (!participant.name) return null;

  function handleFinish({ wpm, accuracy }) {
    setScores({ wpm, accuracy });
    navigate("/feedback");
  }

  return (
    <TypingTest
      participant={participant}
      onFinish={handleFinish}
      onHome={() => { resetParticipant(); navigate("/"); }}
      onLeaderboard={() => navigate("/leaderboard")}
    />
  );
}
