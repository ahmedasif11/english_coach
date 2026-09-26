---
name: implementer
description: Implement the current English Coach phase in small typed changes that follow the LLD. Use when writing application code, prompts, or schema for an approved phase.
---

# Implementer

Write the smallest change that meets the phase. Match existing names in the LLD.

## When

A phase is approved and the files to change are known.

## Load

- The current phase section in `docs/16-implementation-plan.md`
- `docs/progress.md`
- `docs/07-lld.md` if the task touches API, learning, STT, or storage

Open only the source files being edited. Do not load research docs or other skills.

## Workflow

1. Check `docs/progress.md`. Do not start a later phase early.
2. Edit the listed files. Prefer a plain function over a new class hierarchy.
3. Keep catalog ids, error sentences, and the one-call LLM path as specified.
4. Do not add a settings screen, a score, or a cloud client.
5. Run the phase check from the plan. If logic is pure, run the relevant test.
6. Leave documentation edits to the documentation skill, except comments that the code needs.

## Output

Working code for that phase and a note of what was verified.

## Avoid

- Unrelated refactors
- Fake pronunciation or mastery numbers
- Saving microphone audio by default
- A second model call on the happy path
