# Progress

Last updated: 2026-09-26

## Current phase

Phase 3 is complete. The next implementation phase is Phase 4, speech-to-text. Do not start it until asked.

## Phase status

| Phase | Name | Status |
| --- | --- | --- |
| 0 | Research | Done |
| 1 | Documentation, skills, architecture | Done |
| 2 | Basic UI | Done |
| 3 | Microphone capture | Done |
| 4 | Speech-to-text | Not started |
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
- Next.js screen in `frontend/`: today's focus, Start and End, one sample turn and correction. Start captures the microphone locally, silence ends the clip, and the page shows `recorded Ns`. End or leaving the page releases the mic. Audio is not uploaded.

## What does not exist

- Backend
- Prompts on disk
- Database
- Tests
- Installed Ollama model
- Installed Whisper model

## Known risks to verify during implementation

1. Python 3.14 may fail to install faster-whisper dependencies. Fallback is whisper.cpp. Verify in Phase 4 before building around an import that does not work.
2. `qwen2.5:3b` speed on this 2019 CPU is estimated, not measured. Measure in Phase 5 before considering a larger model.
3. Whisper often rewrites learner grammar into correct English. Grammar coaching can only see errors that survive transcription.

## Update rule

After each phase: test the phase, update this file, record decisions that changed, and update a skill only if its workflow changed.
