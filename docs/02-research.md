# Research

Research date: 2026-09-26. Re-check versions before installing. Model and wheel facts move.

## Machine

Inspected on this PC. No models were installed during research.

| Item | Finding |
| --- | --- |
| OS | Windows 11 Pro, 64-bit, 10.0.26200 |
| CPU | Intel Core i7-9850H, 6 cores / 12 threads, 2.6 GHz. Coffee Lake, AVX2, no discrete GPU |
| RAM | 15.8 GB |
| GPU | Intel UHD Graphics 630. `nvidia-smi` is absent |
| Disk | `C:` 179 GB, 23.8 GB free. `D:` 58 GB, 32.1 GB free. Project is on `D:` |
| Python | 3.14.3 only (`py -0p` shows no 3.11 or 3.12) |
| Node.js | 24.11.1, npm 11.6.2 |
| Git | 2.51.2 |
| ffmpeg | 9.0.1 on PATH |
| Ollama | Not installed |

Implications:

- CPU-only inference. A 7B model on this chip is the wrong default for a live conversation.
- 16 GB is shared with Windows, the browser, and Cursor. Keep one small model resident and a short context.
- Put Hugging Face and Ollama files on `D:`. `C:` can fill up from a single model download.
- Python 3.14 is ahead of some scientific wheels. Treat STT install as a spike, not an assumption.

## Local LLM

| Option | Fit | Why it lost or won |
| --- | --- | --- |
| Ollama + `qwen2.5:3b` | Chosen | About 1.9 GB, 32K context advertised, instruct-tuned, strong structured output for its size. Windows app, local HTTP API, JSON schema via `format`. |
| Ollama + `llama3.2:3b` | Alternate | Similar size and speed. Weaker reputation for JSON than Qwen2.5. Easy swap if Qwen rambles. |
| Ollama + `qwen2.5:7b` | Rejected as default | About 4.7 GB and roughly reading-speed or slower on a laptop CPU. Too slow for a turn-based coach on this 2019 chip. Optional later if a 3B model cannot correct simple grammar. |
| 14B and larger | Rejected | Not interactive on 16 GB CPU-only. |
| OpenAI or Gemini API | Rejected for the core path | Cost and privacy. The app must work with the network off after setup. |
| llama.cpp without Ollama | Rejected for MVP | Same weights, more install work. Ollama already wraps llama.cpp. |

CPU-only guidance from current writeups: models under about 4B are usable; 7–8B is tolerable only when the user accepts a slow reply. This coach needs a short reply, so 3B plus a token cap is the latency plan. Measured tokens/second on an i7-12700 are not this machine. Expect this i7-9850H to be slower. Measure in Phase 5.

Ollama structured outputs: `POST /api/chat` accepts `format` as `"json"` or a JSON schema. The prompt must also ask for JSON. Temperature `0` for corrections.

Sources:

- https://ollama.com/library/qwen2.5
- https://qwen.readthedocs.io/en/stable/run_locally/ollama.html
- https://github.com/ollama/ollama/blob/main/docs/api.md
- https://lumadock.com/tutorials/ollama-hardware-requirements
- https://ollamalab.com/posts/ollama-without-gpu-cpu-only/

## Speech-to-text

| Option | Fit | Notes |
| --- | --- | --- |
| faster-whisper `base.en`, CPU int8 | Chosen, pending install | CTranslate2, no PyTorch. Built-in Silero VAD and word timestamps. Official CPU numbers are far faster than original Whisper. Python package is pure Python; native deps must have 3.14 wheels. |
| whisper.cpp | Fallback | Often the fastest CPU Whisper, single binary, ignores the Python version. Use it if faster-whisper does not install. |
| Original openai/whisper | Rejected | PyTorch, slower, heavier. |
| Vosk | Rejected | Small and fast, weaker English accuracy. |
| Browser `SpeechRecognition` | Rejected | In Chromium this sends audio to a cloud recognizer. It is not a local or private default. |

faster-whisper 1.2.1 requires Python >= 3.9 and `ctranslate2>=4.0,<5`. A 1.3.0 pull request for official 3.14 CI was still open as of the April 2026 snapshot found during research. Dependency wheels for 3.14 have been reported (`ctranslate2` 4.7.1, `onnxruntime`, `av`, `tokenizers`). Verify with a real install in Phase 4.

Model size: start with `base.en`. `tiny.en` is faster and less reliable. `small.en` is the upgrade if base misses too much and the extra wait is still acceptable. `large` does not belong on this CPU for interactive turns.

Whisper also has a product defect: it often normalizes learner grammar. A 2025 study of ASR transcripts reported Whisper modifying a very high share of erroneous noun and verb morphology (about 99% of noun errors and 86% of verb errors in that study). Another line of work trains "error-preserving" Whisper because stock Whisper rewrites mistakes. Grammar feedback in this app is therefore a lower bound on mistakes, not a full diagnosis.

Sources:

- https://github.com/SYSTRAN/faster-whisper
- https://pypi.org/project/faster-whisper/1.2.1/
- https://github.com/SYSTRAN/faster-whisper/pull/1439
- https://github.com/ggml-org/whisper.cpp
- https://www.jstage.jst.go.jp/article/letcj/35/0/35_15/_pdf
- https://huggingface.co/Transducens/error-preserving-whisper

## Text-to-speech

| Option | Fit | Notes |
| --- | --- | --- |
| `speechSynthesis` | Chosen for MVP | Already on Windows. No download. Short coach lines can start as soon as the first sentence is ready. Voice quality depends on installed Windows voices. |
| Piper | Later option | Local neural TTS, CPU, good offline quality. Extra binary and a voice model. Add it only if the Windows voice is too poor to want to listen to. |
| ElevenLabs or other hosted TTS | Rejected | Paid and not private. |

`speechSynthesis` audio stays on the machine when the chosen voice is a local Windows voice. It does not provide a file or word timestamps. That is acceptable because the coach speaks short lines.

Sources:

- https://github.com/rhasspy/piper
- https://quick-tts.com/blog/web-speech-api-vs-piper-vs-kokoro.html

## Pronunciation

Stock ASR confidence is not a pronunciation score. A high confidence can mean "the language model was sure," including when it rewrote the word.

Realistic local options:

| Option | Use |
| --- | --- |
| Read-aloud practice plus a phoneme model | The honest later design. Compare expected phones with recognized phones for a known sentence. |
| OpenPronounce | Local Wav2Vec2 phoneme assessment. Two checkpoints around 1.2 GB each, CPU PyTorch, needs ffmpeg and espeak-ng. Heavy for this RAM budget beside a 3B LLM. |
| Montreal Forced Aligner | Accurate, large Kaldi install. Too much system for this app. |
| Whisper `avg_logprob` | Do not present as pronunciation quality. |

MVP decision: no pronunciation score. Phase 10 may try read-aloud phoneme differences on a known sentence and must label the result experimental. If it cannot name a sound difference from the audio, it does not ship a number.

Sources:

- https://pypi.org/project/openpronounce/
- https://github.com/MahmoudAshraf97/ctc-forced-aligner

## Audio features that are real

These can be computed without a second model:

- Utterance duration from the recording
- Speaking rate as words divided by speaking time
- Pauses from client silence detection, or from word-timestamp gaps
- Filler counts from a fixed word list (`um`, `uh`, `like`, `you know`)
- Repeated immediate words and very long unfinished turns

Call them approximations. Accent, noise, and Whisper deletions change the word count.

## Browser

Target Edge or Chrome on this PC. Required APIs: `getUserMedia`, `AudioWorklet`, `speechSynthesis`. Firefox is acceptable if capture works. The app should say when the microphone is blocked.

## Architecture options considered

| Shape | Decision |
| --- | --- |
| Next.js plus FastAPI plus separate workers | Rejected. No SSR, no extra processes. |
| Vite React plus FastAPI | Chosen. One UI, one Python API. |
| Electron | Rejected. Heavier packaging for no MVP gain. A browser tab is enough. |
| Browser-only, WebGPU models | Rejected. Two large models in the browser on a 16 GB iGPU laptop is the slower, riskier path. |
| JSON file storage | Rejected as the main store. Session history and pattern counts are small relational updates. |
| SQLite | Chosen. One file, stdlib, no server. |
| localStorage only | Rejected. Audio turns and history should not depend on one browser profile. |
