# English Coach

A private, local English speaking coach for one person. Open it, press start, talk. The app chooses what to practice and corrects one or two useful problems.

Phase 2 is a static screen in `frontend/`. Later phases are not built yet. See [progress](docs/progress.md).

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

The machine is a Windows 11 laptop with an Intel i7-9850H, 16 GB RAM, and Intel UHD Graphics 630. There is no NVIDIA GPU. Details and tradeoffs are in [research](docs/02-research.md) and [tech stack](docs/08-tech-stack.md).

## Run the UI

```text
cd frontend
npm install
npm run dev
```

Open http://localhost:3000/. Start and End do not call a server yet. The turn on the page is a sample. Stack details are in [tech stack](docs/08-tech-stack.md).
