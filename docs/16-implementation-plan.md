# Implementation Plan

Do one phase at a time. After each phase: run the checks, update `docs/progress.md`, and record any decision that changed.

Phase 0 and Phase 1 are done.

## Phase 2 — Basic UI

Static screen from `docs/14-ui-ux.md`. Start and End do not call a server yet. A fake turn can be hard-coded so the correction card layout exists.

Done when the page shows focus, button, a sample coach line, a sample user line, and a sample correction, in a desktop width and a narrow width.

## Phase 3 — Microphone

Implement `recorder.ts`. Show a local-only transcript placeholder "recorded Ns" after silence detection. No upload.

Done when Start captures speech, silence stops it, End releases the mic, and denial shows the microphone message.

## Phase 4 — Speech-to-text

Spike `pip install faster-whisper` on Python 3.14. Then add `stt.py` and `POST /api/sessions/{id}/turns` returning transcript only.

Done when a spoken sentence comes back as text, empty audio returns the catch message, and the health endpoint reports STT. If install fails, document the whisper.cpp switch before writing more STT code.

Also run the "I go there yesterday" honesty check from `docs/10-speech-pipeline.md`.

## Phase 5 — Conversation

Ollama client, `prompts/turn.txt`, streamed or blocking reply, browser speech. No pattern table yet. Questions can be the five diagnostic lines in order, then a single general prompt.

Done when a reply follows a transcript with Ollama running, and the Ollama-down message appears when it is stopped.

## Phase 6 — Grammar correction

Schema validation, correction card, practice retry state.

Done when a planted transcript with an obvious error can produce one correction, and a second turn is not corrected immediately. Use a text-only test path so this does not depend on the microphone.

## Phase 7 — Learner profile

SQLite and `apply_correction`. Restart the process and show the same focus.

Done when evidence survives restart and a one-off mistake stays `watching`.

## Phase 8 — Topic and focus selection

Wire `topics.py` and session start. Diagnostic flag. Practice burst of three prompts.

Done when a seeded `past_tense` active pattern causes a past-time question on the next session without the user naming the tense.

## Phase 9 — Clarity and fluency

Compute features, store them, surface one approximate note with the template lines. Do not let a filler note replace a grammar correction on the same turn. Grammar wins.

Done when a fast or filler-heavy fixture sets the matching pattern and the UI uses the word Approximate.

## Phase 10 — Pronunciation spike

Time and memory only. No UI score unless the spike meets `docs/11-pronunciation-analysis.md`. Default expectation is a written result in the decision log and no product change.

## Phase 11 — Progress in the loop

Difficulty ladder and resting status. Session end always flushes.

Done when the ladder rule is covered by tests and a normal end writes `ended_at`.

## Phase 12 — Performance

Add the timing fields if they are not already filled. Record a table in `docs/18-performance.md` from real turns. Change only the slowest stage.

## Phase 13 — Cleanup

Remove dead fake UI data, confirm gitignore, read the troubleshooting page against real errors, and run the test list in `docs/17-testing.md`.

## Dependency order

```text
UI → microphone → STT → conversation → grammar → profile → topics
                                              ↘ features (phase 9)
```

Phases 9 and 10 do not block a useful daily loop.
