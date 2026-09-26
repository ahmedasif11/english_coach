---
name: performance-optimizer
description: Reduce measured English Coach latency, model load, or memory. Use when timings exist and a bottleneck is known. Do not optimize from guesses.
---

# Performance Optimizer

Change the slowest measured stage. Read `docs/18-performance.md` first.

## When

Phase 12, or a real session feels slow and `stt_ms` or `llm_ms` is available.

## Load

- `docs/18-performance.md`
- The timing rows or logs for recent turns
- The one function that owns the slow stage

Do not load other skills. Do not profile the whole repository blindly.

## Workflow

1. Record at least five turns before editing.
2. Rank `speech_end → stt_done → llm_first → llm_done → tts_start`.
3. Change one thing: model size, `num_predict`, `num_ctx`, thread count, or streaming.
4. Measure the same kind of utterance again.
5. If RAM is paging, reduce context or loaded models before rewriting the app.
6. Ask the documentation skill to put the numbers in `docs/18-performance.md`.

## Output

Before and after numbers, and what was left alone.

## Avoid

- Switching to a larger model as a speed fix
- Caching coach replies
- Micro-optimizing React or SQLite when the model dominates
- Optimizing pronunciation code that is not in the product
