# Testing

Test behavior the coach could get wrong. Do not test framework defaults.

## Unit tests

| Target | Cases |
| --- | --- |
| `allow_correction` | Short utterance, previous turn already corrected, practice pending, normal turn |
| Pattern status | 2 evidences stay watching; 3 evidences in 2 sessions become active; successes move to resting |
| Priority | Recent success lowers a pattern under an older active one |
| Topic picker | Tag match, no recent repeat, difficulty filter |
| Correction validator | Unknown focus id dropped; `heard` not in transcript dropped; over-long reply trimmed |
| Features | Known timestamp gaps produce the expected pause count; filler list counts `um` and `you know` |

These tests use plain strings and dicts. They do not load Whisper or Ollama.

## Service tests

FastAPI route tests with the STT and LLM functions replaced by fakes:

- Health when Ollama is down
- Turn with empty wav
- Turn that stores a correction
- Unknown session id

## Manual checks

| Check | When |
| --- | --- |
| Say a sentence, see that text | Phase 4 |
| Say "I go there yesterday" and record what Whisper prints | Phase 4 |
| Reply arrives and is spoken | Phase 5 |
| Stop Ollama, see the plain message | Phase 5 |
| Deny the microphone, see the browser message | Phase 3 |
| Second session after restart still has the focus | Phase 7 |
| Narrow window still shows the correction | Phase 2 and after UI edits |

## Not worth testing

- Pixel snapshots of the whole page
- Model quality benchmarks on every commit
- Load tests for concurrent users

## Bug fixes

Reproduce with the smallest input, add a failing test when the logic is pure, then fix. For audio bugs, keep one short fixture wav outside git if it is large; prefer generated WAV bytes when the bug is in the header or the empty-clip path.
