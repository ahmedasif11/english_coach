# Tech Stack

## Decisions

### Frontend

- **Decision:** Vite, React, TypeScript.
- **Alternatives:** Next.js, a single HTML file, Electron.
- **Reason:** The UI is one screen with recording state. Vite is the smallest React setup that still types the API payloads. Next.js adds routing and server concepts this app does not use.
- **Tradeoff:** A production run needs `npm run build` before FastAPI can serve `frontend/dist`.

### Backend

- **Decision:** FastAPI on Python 3.14, the interpreter already installed.
- **Alternatives:** Node server, Flask.
- **Reason:** Speech tooling and SQLite are straightforward in Python. FastAPI gives typed bodies without a second framework.
- **Tradeoff:** Python 3.14 may lack a wheel. That risk is accepted for STT only; the API framework itself is pure Python.

### LLM

- **Decision:** Ollama, model `qwen2.5:3b`, local chat API, JSON schema.
- **Alternatives:** `llama3.2:3b`, `qwen2.5:7b`, hosted APIs, llama.cpp invoked by hand.
- **Reason:** Size fits 16 GB beside Windows and Whisper. Qwen2.5's small instruct models follow JSON well. Ollama is the least install work on Windows.
- **Tradeoff:** A 3B model will miss subtle grammar. The app prefers a fast useful correction over a slow thorough one. 7B stays a measured experiment.

### Speech-to-text

- **Decision:** faster-whisper `base.en`, CPU, int8.
- **Alternatives:** whisper.cpp, openai/whisper, Vosk, browser speech recognition.
- **Reason:** Python integration, VAD, word timestamps, and CPU int8 performance. Browser recognition is not private in Chromium.
- **Tradeoff:** Official Python 3.14 support was not released at research time. Phase 4 must install it first. If it fails, switch the `stt.py` backend to a whisper.cpp binary and keep the same transcript interface.
- **Second tradeoff:** Whisper rewrites many learner errors. See `docs/10-speech-pipeline.md`.

### Text-to-speech

- **Decision:** Browser `speechSynthesis`.
- **Alternatives:** Piper, hosted neural voices.
- **Reason:** No extra model, starts on the first sentence, private for local Windows voices.
- **Tradeoff:** Voice quality is uneven. Piper is the planned replacement, not part of the MVP.

### Pronunciation

- **Decision:** No scorer in the MVP.
- **Alternatives:** OpenPronounce, Whisper confidence, forced alignment.
- **Reason:** Confidence is not pronunciation. A real phoneme model is a second multi-gigabyte load on a 16 GB CPU machine.
- **Tradeoff:** TH-sound practice from the original brief waits until Phase 10, and only as an experiment.

### Storage

- **Decision:** SQLite at `data/coach.db`.
- **Alternatives:** JSON, localStorage, Postgres.
- **Reason:** Pattern updates and session history are queries. One file is still simple.
- **Tradeoff:** The file is not a cloud backup. Copying `data/coach.db` is the backup.

### Audio path

- **Decision:** Browser PCM WAV at 16 kHz. Server-side VAD inside faster-whisper as a second trim.
- **Alternatives:** MediaRecorder webm plus ffmpeg, a separate Silero process.
- **Reason:** WAV skips codec differences. ffmpeg is installed but should not sit on the critical path.

## Install footprint (expected)

| Piece | Disk | RAM while coaching |
| --- | --- | --- |
| `qwen2.5:3b` | ~1.9 GB | ~3 GB with a 2K context |
| `base.en` CTranslate2 | a few hundred MB | under ~1 GB |
| App and browser | small | shared with the desktop |

Set `HF_HOME` and `OLLAMA_MODELS` on `D:` before the first download.

## Not chosen

Paid OpenAI, Gemini, ElevenLabs, cloud databases, authentication, Docker as a requirement, and GPU-only builds.
