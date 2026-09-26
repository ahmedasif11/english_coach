"use client";

import { useEffect, useRef, useState } from "react";
import {
  isMicrophoneDenied,
  MicrophoneReleased,
  openMicrophone,
  type Microphone,
} from "../audio/recorder";
import { SessionScreen } from "../components/SessionScreen";
import type { Correction, SpeakStatus } from "../types";

const MIC_DENIED = "Allow the microphone in the browser, then press Start.";

const sampleCorrection: Correction = {
  focus_id: "past_tense",
  heard: "I go there yesterday.",
  better: "I went there yesterday.",
  rule: "Use the past form because this happened yesterday.",
  practice_prompt: "Say: I went there yesterday.",
};

export default function Page() {
  const [status, setStatus] = useState<SpeakStatus>("idle");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [transcript, setTranscript] = useState("I go there yesterday.");
  const [notice, setNotice] = useState<string | null>(null);
  const micRef = useRef<Microphone | null>(null);
  const busyRef = useRef(false);
  const generationRef = useRef(0);

  useEffect(() => {
    const release = () => {
      generationRef.current += 1;
      busyRef.current = false;
      micRef.current?.release();
      micRef.current = null;
    };
    window.addEventListener("pagehide", release);
    return () => {
      window.removeEventListener("pagehide", release);
      release();
    };
  }, []);

  async function onStart() {
    if (busyRef.current) return;
    busyRef.current = true;
    const generation = generationRef.current;
    setNotice(null);

    try {
      let mic = micRef.current;
      if (!mic) {
        mic = await openMicrophone();
        if (generation !== generationRef.current) {
          mic.release();
          return;
        }
        micRef.current = mic;
        setSessionStarted(true);
      }

      setStatus("listening");
      const clip = await mic.capture();
      if (generation !== generationRef.current) return;
      setTranscript(`recorded ${clip.seconds}s`);
    } catch (error) {
      if (error instanceof MicrophoneReleased) return;
      if (generation !== generationRef.current) return;
      micRef.current?.release();
      micRef.current = null;
      setSessionStarted(false);
      if (isMicrophoneDenied(error)) setNotice(MIC_DENIED);
    } finally {
      if (generation === generationRef.current) {
        busyRef.current = false;
        setStatus("idle");
      }
    }
  }

  function onEnd() {
    generationRef.current += 1;
    busyRef.current = false;
    micRef.current?.release();
    micRef.current = null;
    setSessionStarted(false);
    setStatus("idle");
    setNotice(null);
  }

  return (
    <SessionScreen
      focusLabel="Past tense"
      coachLine="Tell me what you did yesterday."
      transcript={transcript}
      correction={sampleCorrection}
      status={status}
      sessionStarted={sessionStarted}
      notice={notice}
      onStart={() => {
        void onStart();
      }}
      onEnd={onEnd}
    />
  );
}
