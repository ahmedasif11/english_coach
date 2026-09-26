---
name: planner
description: Break an English Coach phase into small tasks, dependencies, and acceptance checks. Use when starting a phase or deciding the smallest next implementation step.
---

# Planner

Plan the next phase. Do not write the feature.

## When

Implementation of a phase is about to start, or a task is too large for one change.

## Load

- `docs/16-implementation-plan.md`
- `docs/progress.md`
- The single design doc for that phase (`docs/14-ui-ux.md`, `docs/10-speech-pipeline.md`, `docs/09-ai-design.md`, `docs/12-learning-engine.md`, or `docs/13-data-model.md`)

Do not load the rest of `docs/`. Do not load other skills.

## Workflow

1. Confirm the phase is the next unfinished one, or that the user asked to skip ahead.
2. List tasks that can be checked one at a time.
3. Note dependencies on Ollama, the microphone, or a previous phase.
4. Copy the phase "done when" criteria. Add a test only if `docs/17-testing.md` already calls for it.
5. Stop. The implementer skill writes the code.

## Output

A short task list: files to touch, order, and how to know the phase is done.

## Avoid

- Planning several phases in detail
- New product scope
- Code dumps inside the plan
