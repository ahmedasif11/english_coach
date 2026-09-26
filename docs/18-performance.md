# Performance

No timings exist yet. Do not tune before Phase 12 fills the table below from real turns on this PC.

## Marks

| Mark | Definition |
| --- | --- |
| `speech_end` | Silence detector fires |
| `stt_done` | Transcript returned |
| `features_done` | Rate and pause counts ready |
| `llm_first` | First token, if streaming |
| `llm_done` | JSON complete |
| `tts_start` | `speechSynthesis` called |

Store `stt_ms` and `llm_ms` on the turn row. The rest can be logged in the browser console until a reason exists to store them.

## Expected bottleneck

On this CPU the likely order is:

1. LLM token generation
2. Whisper
3. Everything else, which should be noise

Features, SQLite, and topic picking should not show up in a profile. If they do, something is wrong.

## Rules before changing code

- Record at least five real turns.
- Optimize the slowest mark only.
- A 3B model with `num_predict` 180 is the intended speed control. Raising model size is not an optimization.
- Do not add a response cache that replays old coaching lines.
- Streaming is justified when `llm_done` is acceptable but time-to-first-sentence feels late.

## Memory

Watch RAM with Ollama, the API, and the browser open. If the machine starts paging, lower `num_ctx` before trying a different app architecture. Unload any extra Ollama model (`OLLAMA_MAX_LOADED_MODELS=1`).

## Frontend

The page is one screen. Avoid large dependencies. Do not animate the microphone. Re-render cost is not the problem until a measurement says it is.
