# Architecture

## Shape

```text
Browser (Next.js)
  capture 16 kHz mono PCM
  detect end of speech
  speak coach lines with speechSynthesis
        |
        | HTTP, localhost only
        v
FastAPI
  session state
  faster-whisper
  audio features
  learning engine
  one Ollama chat call
  SQLite
        |
        v
Ollama on 127.0.0.1:11434
  qwen2.5:3b
```

The browser never calls Ollama directly. The API never calls a paid host.

## Why this split

The browser already owns the microphone and a usable speaking voice. Python owns files, SQLite, and the speech model. Ollama owns model weights and GPU/CPU inference, so swapping `qwen2.5:3b` for another tag is a config change.

Electron, Redis, and a separate database server do not remove a real problem here. Next.js is only the UI. It does not own sessions, speech, or storage.

## Responsibilities

| Component | Owns | Does not own |
| --- | --- | --- |
| Browser | Recording, end-of-speech, playback, layout | Focus choice, storage, prompts |
| API session | Turn order, diagnostic step, practice pending | Free-form lesson planning |
| Speech module | Transcript, language, segment times | Grammar judgment |
| Audio features | Duration, rate, pauses, filler counts | Opinions about "fluency score" |
| Learning engine | Pattern table, priority, topic id, whether to ask for a correction | Wording of the reply |
| LLM client | One structured completion | Memory, thresholds, retries that hide schema failure |
| SQLite | Profile, sessions, turns | Audio archives by default |

## Turn path

```text
PCM wav
  → reject empty audio
  → transcribe
  → features from audio + transcript
  → learning engine builds a small prompt context
       (focus, whether a correction is allowed, topic, last few turns)
  → one Ollama call
  → validate JSON
  → if invalid, one repair call; if still invalid, a canned short reply
  → update patterns only from allowed focus ids
  → return transcript, reply, optional correction, timings
```

A correction is allowed when the turn has enough words and the same focus was not corrected on the previous turn. The model may still return no correction.

## Process model

Development: the Next.js dev server proxies `/api` to FastAPI.

Personal use: Next.js serves the UI and FastAPI serves the API. Ollama stays a separate process because that is how its app works. Docker Compose is not the way to move this to another laptop. See `docs/20-decisions-and-tradeoffs.md`.

## Configuration

Paths are relative to the repo. Clone the repo onto a drive that has room for the models. On this PC the repo is `D:\Practice`, so the default folder is already on `D:`.

| Name | Default | Read by |
| --- | --- | --- |
| `HF_HOME` | `<repo>/.models/hf` | API now |
| `COACH_WHISPER_MODEL` | `base.en` | API now |
| `COACH_CPU_THREADS` | `6` | API now. Lower it on a smaller CPU. |
| `COACH_OLLAMA_URL` | `http://127.0.0.1:11434` | API now, health check only |
| `OLLAMA_MODELS` | set this to `<repo>/.models/ollama` before `ollama pull` | Ollama app, not the API |
| `COACH_LLM_MODEL` | `qwen2.5:3b` | Phase 5 |
| `COACH_DB` | `data/coach.db` | Phase 7 |
| `OLLAMA_MAX_LOADED_MODELS` | `1` | Ollama app |
| `COACH_NUM_CTX` | `2048` | Phase 5 |

No settings page in the MVP.

## Privacy boundary

| Data | Where it goes |
| --- | --- |
| Microphone audio | Browser → FastAPI memory → Whisper. Not written unless debug logging is explicitly enabled. |
| Transcripts and corrections | SQLite on disk |
| Coach prompts | Local Ollama process |
| First-time model downloads | Hugging Face and Ollama hosts, then local files |
| Ongoing turns | No network required |

Localhost is not the privacy boundary. The boundary is: no client of the coach calls a commercial LLM, STT, or TTS host.

## Failure behavior

Health at startup checks Ollama tags and that the Whisper model can load. Messages:

- "Ollama is not running. Start Ollama and try again."
- "The speech model is still downloading." or the install error in one sentence.
- "Allow the microphone in the browser, then press Start."
- "I didn't catch that. Try again."
