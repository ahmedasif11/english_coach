# English Coach

A private, local English speaking coach for one person. Open it, press start, talk. The app chooses what to practice and corrects one or two useful problems.

This repository is in the design phase. Application code has not been started.

## Read first

- [Product overview](docs/00-product-overview.md)
- [Progress](docs/progress.md)
- [Skills](docs/skills.md)
- [Architecture](docs/05-architecture.md)

## Chosen stack

| Piece | Choice |
| --- | --- |
| UI | Vite, React, TypeScript |
| API | Python, FastAPI |
| Speech-to-text | faster-whisper `base.en`, CPU int8 |
| Language model | Ollama `qwen2.5:3b` |
| Speech output | Browser `speechSynthesis` |
| Storage | SQLite |
| Pronunciation scoring | Not in the MVP |

The machine is a Windows 11 laptop with an Intel i7-9850H, 16 GB RAM, and Intel UHD Graphics 630. There is no NVIDIA GPU. Details and tradeoffs are in [research](docs/02-research.md) and [tech stack](docs/08-tech-stack.md).

## Run later

Setup and run commands will be added when the app exists. Do not expect them to work yet.
