"use client";

import { SessionScreen } from "../components/SessionScreen";
import type { Correction } from "../types";

const sampleCorrection: Correction = {
  focus_id: "past_tense",
  heard: "I go there yesterday.",
  better: "I went there yesterday.",
  rule: "Use the past form because this happened yesterday.",
  practice_prompt: "Say: I went there yesterday.",
};

export default function Page() {
  return (
    <SessionScreen
      focusLabel="Past tense"
      coachLine="Tell me what you did yesterday."
      transcript="I go there yesterday."
      correction={sampleCorrection}
      status="idle"
      sessionStarted
    />
  );
}
