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
- **Follow-up:** Python 3.14.3 installed `faster-whisper` 1.2.1 with `ctranslate2` 4.8.2 (`cp314` wheels). whisper.cpp was not needed.

## 2026-09-26 — Honesty check kept go

- **Decision:** Stay on `base.en`. Do not switch to `tiny.en` or `small.en` from this check.
- **Alternatives:** Try `tiny.en` / `small.en` if `base.en` rewrote `go`.
- **Reason:** A local spoken clip of "I go there yesterday" transcribed as `I go there yesterday.` STT took about 1.5 s.
- **Tradeoff:** One clip is not a study. Live microphone turns can still be rewritten. Correct only text that is in the transcript.

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
- **Superseded:** the UI choice only. See "Next.js for the UI" below. Skills stay at the workspace root.

## 2026-09-26 — Next.js for the UI

- **Decision:** Next.js App Router and TypeScript for the UI. FastAPI stays the only API. No Next.js API routes.
- **Alternatives:** Keep Vite. A non-React UI such as plain HTML, Svelte, or Vue.
- **Reason:** The UI framework should be Next.js. Next.js still uses React to render components, so the screen stays React components.
- **Tradeoff:** A larger toolchain than Vite. Daily use runs Next.js and FastAPI, not one process. Next.js does not own sessions, speech, or storage.

## 2026-09-26 — Models on D:

- **Decision:** `HF_HOME` and `OLLAMA_MODELS` should point under `D:\Practice\.models` before downloads.
- **Alternatives:** Default user-profile caches on `C:`.
- **Reason:** `C:` had 23.8 GB free. `D:` had 32.1 GB free and already holds the project.
- **Tradeoff:** A new terminal must see those variables, or downloads land on `C:` anyway.
- **Follow-up:** This was this PC's disk, not a requirement that every laptop has `D:`. See "Clone onto a roomy drive" below.

## 2026-09-26 — Clone onto a roomy drive, no Docker Compose

- **Decision:** Run the coach as the browser UI, FastAPI, and the Ollama app. To use another Windows laptop, clone the repo onto a drive with several gigabytes free and install Python, Node, and Ollama there. Whisper weights default to `<repo>/.models/hf`. Set `OLLAMA_MODELS` to `<repo>/.models/ollama` before `ollama pull`.
- **Alternatives:** `docker compose up` to install packages and models.
- **Reason:** The microphone and the speaking voice are browser APIs on the host. Compose cannot carry those. Git does not store the multi-gigabyte weights, so the first run on a laptop still downloads them. Docker Desktop adds a Linux VM and RAM the 3B model needs. This PC has no NVIDIA GPU to pass through. The API already writes Whisper files under the repo, so the path follows the clone.
- **Tradeoff:** Each laptop installs Python, Node, and Ollama once, and downloads the models again. Copying `.models/` by hand is optional and is not the setup path.
