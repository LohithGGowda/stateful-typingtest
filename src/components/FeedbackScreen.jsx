import { useState } from "react";
import BrandLayout from "./BrandLayout";

const EMOJIS = [
  { value: 1, emoji: "😞", label: "Very Poor" },
  { value: 2, emoji: "😕", label: "Poor" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "😍", label: "Excellent" },
];

/**
 * FeedbackScreen
 * Collects user feedback (1-5 emoji rating) after the typing test.
 * Feedback is stored in the database but never displayed publicly.
 */
export default function FeedbackScreen({ participant, onSubmit, onSkip }) {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    await onSubmit(selected);
  }

  async function handleSkip() {
    setSubmitting(true);
    await onSkip();
  }

  return (
    <BrandLayout participantName={participant.name}>
      <div className="flex flex-col items-center justify-center px-6 py-16 min-h-[calc(100vh-72px)]">
        <div className="w-full max-w-2xl space-y-8">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-4">
              <img
                src="/AWS Student Builder Group_RGB_Icons_Teams_Magenta.png"
                alt=""
                aria-hidden="true"
                className="h-16 w-16 object-contain"
              />
            </div>
            <h1 className="text-4xl font-extrabold text-white">
              How was your experience?
            </h1>
            <p className="text-[#8888aa] text-lg">
              Your feedback helps us improve the typing challenge
            </p>
          </div>

          {/* Emoji selector */}
          <div className="brand-card px-8 py-10">
            <div className="flex justify-center gap-4 flex-wrap">
              {EMOJIS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelected(item.value)}
                  disabled={submitting}
                  className={`feedback-emoji ${selected === item.value ? "feedback-emoji-selected" : ""}`}
                  aria-label={item.label}
                >
                  <span className="text-6xl">{item.emoji}</span>
                  <span className="text-sm text-[#8888aa] mt-2 font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              disabled={submitting}
              className="btn-ghost px-8 py-3 text-sm"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selected || submitting}
              className="btn-primary px-8 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Submit Feedback"}
            </button>
          </div>

          {/* Privacy note */}
          <p className="text-center text-[#555570] text-xs italic">
            Your feedback is anonymous and used only for internal improvement
          </p>

        </div>
      </div>
    </BrandLayout>
  );
}
