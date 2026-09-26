export type Correction = {
  focus_id: string;
  heard: string;
  better: string;
  rule: string;
  practice_prompt: string;
};

export type SpeakStatus = "idle" | "listening" | "working";
