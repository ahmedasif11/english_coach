# Project Structure

The workspace root is the project. Cursor loads `.cursor/skills/` from here. Do not nest a second app folder that hides those skills.

```text
.
├── .cursor/
│   ├── rules/
│   │   └── project.mdc
│   └── skills/
│       ├── project-research/SKILL.md
│       ├── architect/SKILL.md
│       ├── planner/SKILL.md
│       ├── implementer/SKILL.md
│       ├── reviewer/SKILL.md
│       ├── tester-debugger/SKILL.md
│       ├── performance-optimizer/SKILL.md
│       └── documentation/SKILL.md
├── docs/
├── backend/          # Phase 2+ 
│   └── app/
├── frontend/         # Phase 2+
│   └── src/
├── prompts/          # Phase 5
├── data/             # SQLite, gitignored contents
├── tests/
├── README.md
└── .gitignore
```

`backend/`, `frontend/`, `prompts/`, and `tests/` are not created in Phase 1.

## Later files worth having

| Path | When |
| --- | --- |
| `backend/requirements.txt` | Phase 4, after the STT import is known to work |
| `frontend/package.json` | Phase 2 |
| `prompts/turn.txt` | Phase 5 |
| `tests/test_learning.py` | Phase 6–7 |
| `scripts/` | Only if a command is repeated by hand often enough to matter |

No `packages/`, no shared monorepo tooling, no Docker file until there is a second machine to reproduce.
