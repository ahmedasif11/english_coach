import type { Correction, SpeakStatus } from "../types";

type SessionScreenProps = {
  focusLabel: string;
  coachLine: string;
  transcript: string;
  correction: Correction | null;
  status: SpeakStatus;
  sessionStarted: boolean;
};

const startLabels: Record<SpeakStatus, string> = {
  idle: "Start speaking",
  listening: "Listening…",
  working: "Working…",
};

export function SessionScreen({
  focusLabel,
  coachLine,
  transcript,
  correction,
  status,
  sessionStarted,
}: SessionScreenProps) {
  return (
    <main className="app">
      <h1>English Coach</h1>
      <p className="focus">Today: {focusLabel}</p>
      <div className="controls">
        <button type="button">{startLabels[status]}</button>
        {sessionStarted ? (
          <button type="button" className="secondary">
            End
          </button>
        ) : null}
      </div>
      <section className="turn" aria-label="Latest turn">
        <p className="kicker">Coach</p>
        <p className="line">{coachLine}</p>
        <div className="turn-body">
          <div>
            <p className="kicker">You</p>
            <p className="line">{transcript}</p>
          </div>
          {correction ? (
            <aside className="correction">
              <p className="kicker">Heard</p>
              <p className="line">{correction.heard}</p>
              <p className="kicker">Better</p>
              <p className="line">{correction.better}</p>
              <p className="rule">{correction.rule}</p>
              <p className="practice">{correction.practice_prompt}</p>
            </aside>
          ) : null}
        </div>
      </section>
    </main>
  );
}
