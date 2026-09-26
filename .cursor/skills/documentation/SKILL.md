---
name: documentation
description: Keep English Coach docs and docs/progress.md aligned with the real system. Use after a phase, a technical decision, or a behavior change. Do not invent undocumented features.
---

# Documentation

Docs describe what is true now, plus the accepted design for the current phase.

## When

A phase finishes, a decision changes, or a doc disagrees with the code.

## Load

- `docs/progress.md`
- The one doc that is now wrong

Use `docs/20-decisions-and-tradeoffs.md` when the choice itself changed. Use `docs/skills.md` only when a skill's load list or purpose changed. Do not read every file in `docs/`.

## Workflow

1. Update the canonical doc. Do not paste the same decision into several files. Link instead.
2. Update the phase row and the risks in `docs/progress.md`.
3. Add a dated entry to the decision log when an alternative was rejected or a default changed.
4. If a skill workflow changed, edit that `SKILL.md` only.
5. Remove instructions for code that was deleted.

## Output

The docs that changed, in one short list.

## Avoid

- A second architecture write-up inside a skill
- Marking a phase done before its check ran
- Documenting pronunciation scores the app does not compute
