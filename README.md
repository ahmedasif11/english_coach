# English Coach

A private, local English speaking coach for one person. Open it, press start, talk. The app chooses what to practice and corrects one or two useful problems.

Speech-to-text works. Conversation (Phase 5) is next. See [progress](docs/progress.md).

## Read first

- [Product overview](docs/00-product-overview.md)
- [Progress](docs/progress.md)
- [Skills](docs/skills.md)
- [Architecture](docs/05-architecture.md)

## Chosen stack

| Piece | Choice |
| --- | --- |
| UI | Next.js, TypeScript |
| API | Python, FastAPI |
| Speech-to-text | faster-whisper `base.en`, CPU int8 |
| Language model | Ollama `qwen2.5:3b` |
| Speech output | Browser `speechSynthesis` |
| Storage | SQLite |
| Pronunciation scoring | Not in the MVP |

The stack was chosen on a Windows 11 laptop with an Intel i7-9850H, 16 GB RAM, and Intel UHD Graphics 630, and no NVIDIA GPU. Another Windows laptop can run the same programs. Speed follows that machine's CPU. Details are in [research](docs/02-research.md) and [tech stack](docs/08-tech-stack.md).

## Another computer

Clone this repo onto a drive with several gigabytes free. Git does not include the speech or language models. Docker Compose is not the setup path. The decision is in [decisions](docs/20-decisions-and-tradeoffs.md).

On that laptop, install Python 3.14, Node.js, and the Ollama Windows app. Then:

```text
set OLLAMA_MODELS=%CD%\.models\ollama
ollama pull qwen2.5:3b
```

Whisper downloads into `.models\hf` the first time the API starts. If a pull or import fails, use [troubleshooting](docs/19-troubleshooting.md).

## Run

API, from `backend` after `pip install -r requirements.txt`:

```text
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

UI:

```text
cd frontend
npm install
npm run dev
```

Open http://localhost:3000/. The page sends microphone audio to the API and shows the transcript. The coach reply arrives in Phase 5, after Ollama is wired in.
