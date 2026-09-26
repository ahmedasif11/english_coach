export type Correction = {
  focus_id: string;
  heard: string;
  better: string;
  rule: string;
  practice_prompt: string;
};

export type SpeakStatus = "idle" | "listening" | "working";

export type Health = {
  ollama: "ok" | "down";
  stt: "ok" | "loading" | "error";
  model: string;
};

export type SessionStart = {
  id: string;
  focus_label: string;
  mode: string;
  question: string;
};

export type TurnResponse = {
  transcript: string;
  reply: string;
  correction: Correction | null;
  focus_label: string;
  timings_ms: {
    stt: number;
    features: number;
    llm: number;
  };
};
