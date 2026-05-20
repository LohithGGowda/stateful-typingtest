import { createContext, useContext, useState } from "react";

/**
 * ParticipantContext
 * Holds participant registration details and final scores across all routes.
 * Uses sessionStorage so data survives a page refresh within the same tab.
 */

const ParticipantContext = createContext(null);

const EMPTY_PARTICIPANT = {
  role: "", name: "", usn: "", department: "", designation: "",
};
const EMPTY_SCORES = { wpm: 0, accuracy: 100 };

function readSession(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function writeSession(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function ParticipantProvider({ children }) {
  const [participant, setParticipantState] = useState(
    () => readSession("participant", EMPTY_PARTICIPANT)
  );
  const [scores, setScoresState] = useState(
    () => readSession("scores", EMPTY_SCORES)
  );

  function setParticipant(data) {
    setParticipantState(data);
    writeSession("participant", data);
  }

  function setScores(data) {
    setScoresState(data);
    writeSession("scores", data);
  }

  function resetParticipant() {
    setParticipant(EMPTY_PARTICIPANT);
    setScores(EMPTY_SCORES);
  }

  return (
    <ParticipantContext.Provider value={{ participant, setParticipant, scores, setScores, resetParticipant }}>
      {children}
    </ParticipantContext.Provider>
  );
}

export function useParticipant() {
  const ctx = useContext(ParticipantContext);
  if (!ctx) throw new Error("useParticipant must be used inside ParticipantProvider");
  return ctx;
}
