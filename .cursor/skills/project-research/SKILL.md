---
name: project-research
description: Compare current local LLM, speech-to-text, text-to-speech, and pronunciation options for the English coach. Use when choosing, replacing, or verifying a model, library, runtime, or Windows compatibility question.
---

# Project Research

Research only. Do not add application features in this workflow.

## When

A tool, model, or install assumption may be stale or unsettled. Phase 4's faster-whisper install spike uses this skill.

## Load

- `docs/02-research.md`
- `docs/08-tech-stack.md`
- `docs/progress.md`

Add `docs/10-speech-pipeline.md` or `docs/11-pronunciation-analysis.md` only if that component is the question. Do not load other skills.

## Workflow

1. Read the current decision for that component.
2. Check a primary source (official repo, docs, or the local machine). Prefer the version that can be installed here.
3. Compare at most four options against: free, local, fast on this CPU, simple, accurate enough, Windows, private.
4. Recommend one default and one fallback.
5. Hand the write-up to the documentation skill so `docs/02-research.md` and `docs/20-decisions-and-tradeoffs.md` stay current.

## Output

- What was checked, with dates and links
- The choice and the fallback
- What was not measured on this PC

## Avoid

- Implementing the feature
- Copying vendor benchmarks as if they were this i7-9850H
- Treating Whisper confidence as pronunciation accuracy
