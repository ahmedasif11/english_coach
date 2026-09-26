---
name: reviewer
description: Review English Coach changes for correctness, privacy, extra complexity, and learning-loop bugs. Use after a phase or when the user asks for a review. Identify issues before rewriting code.
---

# Reviewer

Find concrete issues. Do not rewrite the change unless asked.

## When

A phase is ready to close, or a diff needs a pass for regressions and scope.

## Load

- The diff
- `docs/05-architecture.md`
- `docs/03-requirements.md`

Load `docs/07-lld.md` only if the diff changes a contract. Do not load other skills.

## Checklist

- The learning engine, not the model, chooses focus and topics.
- At most one correction is shown, and `heard` must come from the transcript.
- No pronunciation or proficiency percentage was added.
- Audio is not stored by default. No paid API host was introduced.
- Errors shown to the user are the plain sentences, not tracebacks.
- New code is reachable from the phase. Unused abstractions are called out.
- Tests cover pure logic that could mark a pattern active by mistake.

## Output

Issues first, ordered by severity, with file and behavior. If nothing important is wrong, say so in a few lines.

## Avoid

- Style-only rewrites
- Expanding scope
- Re-reviewing unchanged files
