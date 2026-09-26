# Decisions and Tradeoffs

Format for new entries: decision, alternatives, reason, tradeoff, date.

## 2026-09-26 — Local 3B model through Ollama

- **Decision:** `qwen2.5:3b` via Ollama.
- **Alternatives:** Hosted APIs, `llama3.2:3b`, `qwen2.5:7b`, llama.cpp without Ollama.
- **Reason:** No API cost, private turns, JSON schema support, about 2 GB on disk. This PC has no NVIDIA GPU and 16 GB RAM.
- **Tradeoff:** Grammar help will be simpler and sometimes wrong. A 7B model is probably too slow on the i7-9850H for spoken turns. Measure before switching.

## 2026-09-26 — faster-whisper base.en, with a fallback

- **Decision:** faster-whisper `base.en` int8 on CPU. If Python 3.14 cannot install it, use whisper.cpp behind the same transcript function.
- **Alternatives:** Browser speech recognition, Vosk, original Whisper, starting on whisper.cpp immediately.
- **Reason:** Word timestamps and a Python API keep the first design smaller. Browser recognition on Chromium is a cloud service.
- **Tradeoff:** Install risk on Python 3.14. Whisper also rewrites learner grammar, so coaching is incomplete by nature.

## 2026-09-26 — Browser speech synthesis

- **Decision:** `speechSynthesis` for coach audio.
- **Alternatives:** Piper now, hosted TTS.
- **Reason:** No download and no extra RAM. Replies are short.
- **Tradeoff:** Voice quality depends on Windows. Piper stays optional.

## 2026-09-26 — No pronunciation score

- **Decision:** Do not ship a pronunciation number. A later spike may describe a phone difference on a known sentence.
- **Alternatives:** Whisper confidence, OpenPronounce beside the LLM.
- **Reason:** Confidence is not accuracy. A second large acoustic model does not fit the RAM budget beside the coach model.
- **Tradeoff:** TH-sound and similar practice from the brief are postponed.

## 2026-09-26 — Learning engine in code

- **Decision:** Catalog, priority, topics, and correction gating are Python. One LLM call writes the reply and at most one correction.
- **Alternatives:** A planner agent, a separate grammar call, user-chosen lessons.
- **Reason:** Predictable focus and half the generation time versus two calls.
- **Tradeoff:** The catalog will miss unusual errors until an id is added on purpose.

## 2026-09-26 — Evidence instead of scores

- **Decision:** Store counts, examples, recency, and status. Show a label.
- **Alternatives:** 0–1 mastery scores on every skill.
- **Reason:** The counts map to real events. A score would look more precise than the transcript allows.
- **Tradeoff:** The UI looks plainer, which is intended.

## 2026-09-26 — SQLite

- **Decision:** One SQLite file.
- **Alternatives:** JSON, localStorage, a database server.
- **Reason:** Session and pattern queries without another service.
- **Tradeoff:** Must not leave the file open in a way that blocks a copy. Closing the app is the backup story.

## 2026-09-26 — Vite and FastAPI, workspace root

- **Decision:** React with Vite, FastAPI, skills at the workspace root.
- **Alternatives:** Next.js, Electron, a nested `english-coach/` folder.
- **Reason:** One screen does not need Next.js. A nested root would hide `.cursor/skills/` from this workspace.
- **Tradeoff:** Production needs a frontend build step.

## 2026-09-26 — Models on D:

- **Decision:** `HF_HOME` and `OLLAMA_MODELS` should point under `D:\Practice\.models` before downloads.
- **Alternatives:** Default user-profile caches on `C:`.
- **Reason:** `C:` had 23.8 GB free. `D:` had 32.1 GB free and already holds the project.
- **Tradeoff:** A new terminal must see those variables, or downloads land on `C:` anyway.
