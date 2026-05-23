/**
 * Route: /feedback
 * Collects user feedback after the typing test, before showing results.
 * Guards: redirects to / if no participant registered.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParticipant } from "../context/ParticipantContext";
import { saveScore } from "../utils/leaderboard";
import FeedbackScreen from "../components/FeedbackScreen";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { participant, scores } = useParticipant();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!participant.name || !scores.wpm) {
      navigate("/", { replace: true });
    }
  }, [participant.name, scores.wpm, navigate]);

  if (!participant.name || !scores.wpm) return null;

  async function handleSubmit(feedback) {
    setSubmitting(true);
    await saveScore({
      name: participant.name,
      usn: participant.usn,
      role: participant.role,
      department: participant.department,
      designation: participant.designation,
      wpm: scores.wpm,
      accuracy: scores.accuracy,
      feedback,
    });
    navigate("/results", { replace: true });
  }

  async function handleSkip() {
    setSubmitting(true);
    await saveScore({
      name: participant.name,
      usn: participant.usn,
      role: participant.role,
      department: participant.department,
      designation: participant.designation,
      wpm: scores.wpm,
      accuracy: scores.accuracy,
    });
    navigate("/results", { replace: true });
  }

  if (submitting) return null;

  return (
    <FeedbackScreen
      participant={participant}
      onSubmit={handleSubmit}
      onSkip={handleSkip}
    />
  );
}
