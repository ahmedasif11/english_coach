# Troubleshooting

Messages the UI should show are specified in `docs/07-lld.md`. This page is for the person maintaining the app.

## Ollama is not running

Install Ollama from the official Windows installer, start the app, then pull the model onto `D:`:

```text
set OLLAMA_MODELS=D:\Practice\.models\ollama
ollama pull qwen2.5:3b
```

Check `http://127.0.0.1:11434/api/tags` in the browser. The coach health route should report `ollama: ok`.

## Wrong or missing model

`COACH_LLM_MODEL` must match a name in the tags list. The default is `qwen2.5:3b`.

## Whisper will not import

Python on this machine is 3.14. If `faster-whisper` or `ctranslate2` has no working wheel, stop and switch `stt.py` to whisper.cpp. Do not install a random older Python until that fallback is also bad. Record the pip error in the decision log.

Set the download directory before the first successful import:

```text
set HF_HOME=D:\Practice\.models\hf
```

`C:` had about 24 GB free on 2026-09-26. A cache on `C:` can fill the system disk.

## First turn is very slow

The model may still be loading. Later turns should be faster. If every turn is slow, read `stt_ms` and `llm_ms` before changing code.

## The transcript "fixes" my English

That is a known Whisper behavior, documented in `docs/10-speech-pipeline.md`. Compare the on-screen transcript with what you said. The coach can only teach what is written there.

## Microphone

Edge or Chrome. If the button fails, the site permission is blocked. The page cannot override that.

## Speech is silent

Windows may have no working `speechSynthesis` voice. The text reply is still the session. Piper is the later fix, not a reason to stop practice.

## Disk

Model directories belong on `D:`. The SQLite file is `data/coach.db` in the project. Deleting it wipes history.
