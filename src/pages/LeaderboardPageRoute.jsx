/**
 * Route: /leaderboard
 * Full leaderboard — Students and Faculty side by side.
 * No registration guard — publicly accessible.
 */
import { useNavigate } from "react-router-dom";
import { useParticipant } from "../context/ParticipantContext";
import LeaderboardPage from "../components/LeaderboardPage";

export default function LeaderboardPageRoute() {
  const navigate = useNavigate();
  const { participant, resetParticipant } = useParticipant();

  return (
    <LeaderboardPage
      onBack={() => navigate(-1)}
      onHome={() => { resetParticipant(); navigate("/"); }}
      onLeaderboard={() => navigate("/leaderboard")}
    />
  );
}
