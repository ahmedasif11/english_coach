# Architecture

## Shape

```text
Browser (Vite + React)
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

Next.js, Electron, Redis, and a separate database server do not remove a real problem here.

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

Development: Vite dev server proxies `/api` to FastAPI.

Personal use: FastAPI serves the built UI and the API. Two terminals in development, one process in daily use. Ollama stays a separate process because that is how its app works.

## Configuration

Environment variables, with defaults that match this machine:

| Name | Default intent |
| --- | --- |
| `OLLAMA_HOST` | `http://127.0.0.1:11434` |
| `COACH_LLM_MODEL` | `qwen2.5:3b` |
| `COACH_STT_MODEL` | `base.en` |
| `COACH_DB` | `data/coach.db` |
| `HF_HOME` | a directory on `D:` |
| `OLLAMA_MODELS` | a directory on `D:` |
| `OLLAMA_MAX_LOADED_MODELS` | `1` |
| `COACH_NUM_CTX` | `2048` |

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
