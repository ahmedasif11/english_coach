# Speech Pipeline

## Capture

1. `getUserMedia({ audio: true })`.
2. An `AudioWorklet` converts float samples to 16 kHz mono.
3. RMS above a small threshold marks speech.
4. After speech, 900 ms below the threshold ends the clip. 60 seconds forces an end.
5. The page builds a WAV and uploads it.
6. The microphone stops when the session ends or the page closes.

The threshold will need a tweak on this laptop's microphone. Keep it as a named constant, not a setting screen.

## Transcription settings

```text
model: base.en
device: cpu
compute_type: int8
language: en
beam_size: 1
condition_on_previous_text: false
vad_filter: true
word_timestamps: true
```

Load once at startup. English-only weights are smaller and avoid language detection flips.

## Why the transcript can lie about grammar

Whisper is trained to produce likely written English. For learners, that means the transcript may be better than the speech. Published checks on non-native transcripts found Whisper rewriting most morphological errors it could have preserved. An error-preserving fine-tune exists because this behavior is a known gap, and that fine-tune is a large model aimed at researchers, not this laptop.

Consequences for the coach:

- Show the transcript on every turn so a mismatch is visible.
- Correct only text that is actually in the transcript.
- Do not claim "no grammar issues" means the speech was correct. Say nothing instead.
- Do not run a second model pass to "fix" the transcript before correction. That would hide the remaining evidence.
- Prefer `base.en` over `large` until there is a reason to spend the latency. Larger models are not assumed to be more honest about errors.

Phase 4 should include one manual check: say "I go there yesterday" and record whether the transcript keeps `go`. If `base.en` rewrites it, try the same clip with `tiny.en` and `small.en` and keep the smallest model that still understands the sentence. Record the result in `docs/20-decisions-and-tradeoffs.md`.

## Latency budget

Target for a 10 second utterance on this CPU, to be replaced by measurements:

| Stage | Hope |
| --- | --- |
| End of speech → transcript | under 3 seconds with `base.en` int8 |
| Transcript → first reply token | a few seconds at 3B |
| Full reply | under about 15 seconds of generation for a short answer |

If STT alone is over 5 seconds on a short turn, switch model size or the whisper.cpp fallback before adding features.

## Streaming

Stream Ollama tokens to the browser and start `speechSynthesis` at the first sentence boundary. The correction card appears when the JSON is complete. If streaming JSON is awkward to parse incrementally, stream only after a trivial split is implemented; otherwise show "Thinking" and still cancel playback when a new turn starts. Do not block the MVP on token streaming if a full short reply is already under the budget. Measure first.

## Privacy

Audio bytes live in the request and the Whisper call. Default is not to save wav files. A debug flag may write them under `data/audio/`, which is gitignored.
