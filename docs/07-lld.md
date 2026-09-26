# Low-Level Design

This is the design to implement. Names can change slightly if a file would be clearer. Do not add layers that only forward calls.

## Backend modules

| Module | Role |
| --- | --- |
| `backend/app/main.py` | Routes, lifespan, static files |
| `backend/app/config.py` | Environment defaults |
| `backend/app/schemas.py` | Request and response models |
| `backend/app/session.py` | Diagnostic index, pending practice, in-memory session plus DB row |
| `backend/app/stt.py` | Load Whisper once, transcribe WAV bytes |
| `backend/app/features.py` | Rate, pauses, fillers |
| `backend/app/learning.py` | Catalog, priority, topic choice, profile updates |
| `backend/app/topics.py` | Prompt strings and tags |
| `backend/app/llm.py` | Ollama chat, schema, one repair |
| `backend/app/store.py` | SQLite access |
| `prompts/turn.txt` | The only MVP prompt |

## Routes

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/api/health` | `{ ollama: "ok" \| "down", stt: "ok" \| "loading" \| "error", model }` |
| `POST` | `/api/sessions` | Create session. Body: none. Returns focus label, mode, first question. |
| `POST` | `/api/sessions/{id}/turns` | Multipart or raw `audio/wav`. Returns the turn payload below. |
| `POST` | `/api/sessions/{id}/end` | Close session, flush profile. |
| `GET` | `/api/profile` | Focus label and active pattern labels. No raw scores. |

## Turn response

```json
{
  "transcript": "I go there yesterday.",
  "reply": "What else did you do after that?",
  "correction": {
    "focus_id": "past_tense",
    "heard": "I go there yesterday.",
    "better": "I went there yesterday.",
    "rule": "Use the past form because this happened yesterday.",
    "practice_prompt": "Say: I went there yesterday."
  },
  "focus_label": "Past tense",
  "timings_ms": {
    "stt": 0,
    "features": 0,
    "llm": 0
  }
}
```

`correction` is `null` when nothing should be taught this turn.

## LLM schema

The server sends this schema as Ollama `format`, and also describes it in the prompt.

```json
{
  "type": "object",
  "properties": {
    "reply": { "type": "string" },
    "correction": {
      "type": ["object", "null"],
      "properties": {
        "focus_id": { "type": "string" },
        "heard": { "type": "string" },
        "better": { "type": "string" },
        "rule": { "type": "string" },
        "practice_prompt": { "type": "string" }
      },
      "required": ["focus_id", "heard", "better", "rule", "practice_prompt"]
    }
  },
  "required": ["reply", "correction"]
}
```

Server rules after parse:

- Trim `reply` to two sentences.
- If `correction_allowed` is false, set `correction` to null.
- If `focus_id` is not in the catalog, drop the correction.
- If `heard` is not a substring of the transcript, drop the correction. This blocks invented quotes.
- `rule` longer than 200 characters is truncated.

If JSON fails, send the raw output back once with "return only the schema". If that fails, reply with "Let's try that again." and no correction.

Generation options: `temperature` 0.2, `num_predict` 180, `num_ctx` 2048. The cap keeps the model from lecturing and limits CPU time.

## Session state

```text
created → diagnostic (step 0..4) → conversation
conversation → practice_pending → conversation
any → ended
```

`practice_pending` means the next user turn is judged as a retry of `better`, not as a new open answer. The learning engine marks success when the new transcript is close to `better` (simple normalized string match or the model says the retry is acceptable inside the same schema). Prefer the string check so a retry does not need a special prompt. If the retry still differs, leave evidence in place and continue. Do not stack a second lecture.

## Learning functions

- `start_session(store) -> SessionPlan` with mode, focus_id, question
- `allow_correction(transcript, session) -> bool`
- `apply_correction(store, session_id, correction) -> None`
- `mark_practice(store, focus_id, success: bool) -> None`
- `next_question(store, session) -> str`

`allow_correction` is false when word count < 6, or the previous turn already corrected, or the session is in `practice_pending`.

Priority is internal:

```text
priority = evidence_count * severity_weight * recency_weight
severity_weight: high 1.5, medium 1.0, low 0.6
recency_weight: 1.0 if last_seen within 14 days, else 0.5
if success_count increased in the last session: multiply by 0.5
```

Do not return this number to the UI.

Active rule: `evidence_count >= 3` and evidence from at least two session ids. Until then the pattern is `watching`. Watching patterns can still be corrected in the moment. They do not take over topic selection.

## Audio features

```text
words = transcript split on whitespace
speech_seconds = max(duration - leading and trailing silence, 0.1)
wpm = words / speech_seconds * 60
pause_count = gaps between word timestamps > 0.8 s
filler_count = matches of um, uh, er, ah, like, you know
```

Phase 9 writes a clarity pattern when `wpm > 190` or `filler_count >= 4` in one turn, and a fluency pattern when `pause_count >= 5` on a turn longer than 8 seconds. Thresholds are heuristics. The UI must say "approximate".

MVP phases before 9 may compute and store the numbers without coaching them.

## STT loader

Load the model at process start, not on the first request, so the first turn does not pay the load. `device="cpu"`, `compute_type="int8"`, `cpu_threads` about 6. Language locked to English.

If import or load fails, health returns `stt: error` and turns respond with the plain message. Do not fall through to a cloud recognizer.

## Errors

| Case | HTTP | User text |
| --- | --- | --- |
| Mic denied | browser only | Allow the microphone in the browser, then press Start. |
| Empty audio | 422 | I didn't catch that. Try again. |
| STT exception | 503 | Transcription failed. Try that sentence again. |
| Ollama connection error | 503 | Ollama is not running. Start Ollama and try again. |
| Ollama model missing | 503 | The English model is not installed. Pull qwen2.5:3b in Ollama. |
| Unknown session | 404 | Start a new session. |

Log the exception on the server. Do not send the traceback to the page.

## Frontend modules

| Module | Role |
| --- | --- |
| `frontend/src/app/page.tsx` | Layout and session state |
| `frontend/src/api.ts` | `health`, `startSession`, `sendTurn`, `endSession` |
| `frontend/src/audio/recorder.ts` | Worklet, WAV encode, silence stop |
| `frontend/src/audio/speak.ts` | `speechSynthesis`, cancel on new turn |
| `frontend/src/components/SessionScreen.tsx` | Focus line, button, transcript, correction |

One screen component is enough. Split only when the file becomes hard to read.

## WAV from the browser

Write a 16-bit PCM WAV header in the page and post the bytes. The server does not depend on ffmpeg for the hot path. ffmpeg may be used in tests to make fixtures.
