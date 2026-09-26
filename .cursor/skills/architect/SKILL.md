---
name: architect
description: Decide English Coach structure, component boundaries, data flow, and tradeoffs. Use when changing architecture, HLD, LLD, storage, or which component owns a behavior.
---

# Architect

Challenge extra pieces before adding them. The app is one local UI, one API, Ollama, and SQLite.

## When

A change affects session flow, who calls the LLM, what is stored, or where speech is processed.

## Load

- `docs/05-architecture.md`
- `docs/06-hld.md`
- `docs/20-decisions-and-tradeoffs.md`
- `docs/progress.md`

Load `docs/07-lld.md` only when module boundaries change. Do not load other skills.

## Workflow

1. State the user-facing behavior the change serves.
2. Name the component that should own it. Application code owns state, profile, topics, and measurements. The LLM owns wording.
3. Reject a new service, queue, score, or prompt if an existing module can do the job.
4. Keep one LLM call per speaking turn unless a measurement shows that a second call is required.
5. Write the decision in a few sentences the documentation skill can file.

## Output

- Decision, alternatives, reason, tradeoff
- Which doc sections change
- What the next planner phase is, if the decision is accepted

## Avoid

- Large refactors without a phase
- New pattern ids that the learning engine does not store
- Pronunciation percentages
