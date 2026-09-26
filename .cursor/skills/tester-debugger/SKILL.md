---
name: tester-debugger
description: Reproduce English Coach bugs and verify fixes with focused tests. Use when adding tests, checking a phase, debugging STT, microphone, Ollama, or learning-engine behavior.
---

# Tester / Debugger

Prove the failure, then prove the fix. Follow `docs/17-testing.md`.

## When

A bug is reported, a phase needs its acceptance check, or a pure function needs a regression test.

## Load

- `docs/17-testing.md`
- The failing test, log, or the module under debug
- `docs/07-lld.md` only for the function being checked

Do not load the full doc set or other skills.

## Workflow

1. Reproduce with the smallest input: a string for learning logic, a tiny WAV for audio, or the health route for Ollama.
2. Separate product limits from bugs. Whisper rewriting grammar is a limit documented in `docs/10-speech-pipeline.md`, not an automatic defect.
3. Add a test when the behavior is deterministic. Skip tests that only assert the framework works.
4. Fix through the implementer workflow if code must change.
5. Re-run the same reproduction.

## Output

- How to reproduce
- Cause
- What was re-checked

## Avoid

- Snapshot galleries
- Live model tests in the default unit run
- Changing thresholds without recording the old and new behavior
