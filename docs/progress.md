# Progress

Last updated: 2026-09-26

## Current phase

Phase 4 is complete. The next implementation phase is Phase 5, basic conversation. Do not start it until asked.

## Phase status

| Phase | Name | Status |
| --- | --- | --- |
| 0 | Research | Done |
| 1 | Documentation, skills, architecture | Done |
| 2 | Basic UI | Done |
| 3 | Microphone capture | Done |
| 4 | Speech-to-text | Done |
| 5 | Basic conversation | Not started |
| 6 | Grammar analysis | Not started |
| 7 | Learner profile | Not started |
| 8 | Automatic topic and focus selection | Not started |
| 9 | Clarity and fluency analysis | Not started |
| 10 | Pronunciation experiment | Not started |
| 11 | Progress tracking in the session flow | Not started |
| 12 | Performance measurement and optimization | Not started |
| 13 | Testing and cleanup | Not started |

## What exists

- Hardware inspection recorded in `docs/02-research.md`
- Stack decisions recorded in `docs/08-tech-stack.md` and `docs/20-decisions-and-tradeoffs.md`
- Product, architecture, HLD, LLD, learning engine, speech, and data-model docs
- Project skills under `.cursor/skills/`
- Short always-on rule in `.cursor/rules/project.mdc`
- Next.js screen in `frontend/`: today's focus, Start and End, a sample turn until the first session. Start captures the microphone, silence ends the clip, and the page uploads the WAV to FastAPI. The You line shows the transcript. End or leaving the page releases the mic. Audio is not saved unless `COACH_SAVE_AUDIO` is set.
- FastAPI in `backend/`: health, in-memory sessions, and `POST /api/sessions/{id}/turns` returning transcript only. Empty audio returns `I didn't catch that. Try again.`
- faster-whisper `base.en` int8 on CPU, weights under `D:\Practice\.models\hf`
- FastAPI route tests with Whisper replaced by a fake

## What does not exist

- Prompts on disk
- Database
- Ollama conversation path
- Installed Ollama model

## Known risks to verify during implementation

1. Python 3.14 installed `faster-whisper` 1.2.1 and `ctranslate2` 4.8.2. whisper.cpp is unused.
2. `qwen2.5:3b` speed on this 2019 CPU is estimated, not measured. Measure in Phase 5 before considering a larger model.
3. Whisper often rewrites learner grammar. On one local `I go there yesterday` clip, `base.en` kept `go`. Keep checking real microphone turns; do not assume every error survives.

## Update rule

After each phase: test the phase, update this file, record decisions that changed, and update a skill only if its workflow changed.
