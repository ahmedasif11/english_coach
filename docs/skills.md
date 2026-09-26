# Skills

Project skills live in `.cursor/skills/`. Each skill is a short workflow. Canonical detail stays in `docs/`.

Load one skill for the task. Do not load every skill, and do not read every document.

## Available skills

| Skill | Purpose | Use when |
| --- | --- | --- |
| `project-research` | Compare current tools and record sources | Choosing or replacing a library, model, or runtime |
| `architect` | Decide structure, boundaries, and tradeoffs | Changing components, data flow, or a technical decision |
| `planner` | Turn a decision into the next small phase | Starting implementation of a phase or feature |
| `implementer` | Write the smallest code that matches the design | Implementing an approved phase |
| `reviewer` | Find concrete defects without rewriting the project | After a phase or before calling work done |
| `tester-debugger` | Reproduce, test, and verify a fix | Adding tests, checking a phase, or chasing a bug |
| `performance-optimizer` | Reduce measured latency or memory | After timings exist and a bottleneck is known |
| `documentation` | Keep `docs/` equal to the system that exists | After behavior, decisions, or phase status change |

## What each skill should load

| Skill | Read | Ignore |
| --- | --- | --- |
| `project-research` | `docs/02-research.md`, `docs/08-tech-stack.md`, `docs/progress.md` | Application source, other skills |
| `architect` | `docs/05-architecture.md`, `docs/06-hld.md`, `docs/20-decisions-and-tradeoffs.md`, `docs/progress.md` | Unrelated docs, other skills |
| `planner` | `docs/16-implementation-plan.md`, `docs/progress.md`, the one design doc for the phase | Full doc set |
| `implementer` | The phase section in `docs/16-implementation-plan.md`, `docs/07-lld.md` only if the task touches those modules, `docs/progress.md` | Research history, other phases |
| `reviewer` | The diff, `docs/05-architecture.md`, `docs/03-requirements.md` | Unchanged docs |
| `tester-debugger` | `docs/17-testing.md`, the failing test or the code under debug | Architecture essays |
| `performance-optimizer` | `docs/18-performance.md`, measured timings, the slow function | Speculative refactors of fast code |
| `documentation` | `docs/progress.md`, the doc whose facts changed | Skills that did not change |

## How skills relate

```text
project-research → architect → documentation
architect → planner → implementer → tester-debugger → reviewer → documentation
performance-optimizer runs only after tester-debugger or a measured session
```

A small bug uses `tester-debugger`, then `implementer`, then `reviewer`. It does not need research or a new architecture.

## Invocation

- These skills are meant to be selected when the task matches the description. Do not run the full chain on every request.
- Skills do not call each other by pasting their text into context. Follow the next skill's file only when the workflow says to switch.
- `documentation` is the skill that edits `docs/`. Other skills should not rewrite the doc set while implementing.

## Token strategy

- Skill files stay short and point here or at one canonical doc.
- Do not copy architecture into skills.
- Do not re-read an unchanged document in the same task.
- Before a large change, name the skill, the docs, and the files required. Skip the rest.
