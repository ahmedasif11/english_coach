# High-Level Design

## Components

```text
┌─────────────────────────────────────────────┐
│ Browser                                     │
│  Start / End                                │
│  Recorder (AudioWorklet → 16 kHz PCM)       │
│  Silence detector                           │
│  Conversation list                          │
│  Correction card                            │
│  speechSynthesis                            │
└──────────────────┬──────────────────────────┘
                   │ POST /api/turns  (wav)
                   │ GET  /api/health
                   │ POST /api/sessions
┌──────────────────▼──────────────────────────┐
│ FastAPI                                     │
│  ┌────────────┐  ┌────────────────────────┐ │
│  │ Session    │  │ Learning engine        │ │
│  │ controller │──│ patterns, topics, gate │ │
│  └─────┬──────┘  └───────────┬────────────┘ │
│        │                     │              │
│  ┌─────▼──────┐  ┌───────────▼────────────┐ │
│  │ STT        │  │ LLM client → Ollama    │ │
│  │ features   │  │ one schema per turn    │ │
│  └─────┬──────┘  └───────────┬────────────┘ │
│        └──────────┬──────────┘              │
│                   ▼                         │
│                SQLite                       │
└─────────────────────────────────────────────┘
```

## Speech pipeline

1. The worklet downsamples microphone audio to 16 kHz mono PCM.
2. The page watches RMS. After speech has started, about 0.9 seconds of silence ends the turn. Maximum utterance length is 60 seconds.
3. The page posts a WAV body with the session id.
4. The server rejects clips shorter than 0.4 seconds.
5. faster-whisper transcribes with `language=en`, `vad_filter=True`, `beam_size=1`, `condition_on_previous_text=False`.
6. Word timestamps feed pause estimates. The transcript is what the user sees and what the model corrects.

`beam_size=1` and `condition_on_previous_text=False` are there to reduce extra language-model rewriting. They do not guarantee error-preserving text.

## AI pipeline

The learning engine prepares a compact context:

- mode: `diagnostic`, `conversation`, or `practice`
- today's focus id, or none
- the question the user was answering
- whether a correction is allowed this turn
- the last four user/coach pairs, truncated
- the new transcript

One chat call returns the reply and an optional correction. The server checks the focus id against the catalog. Unknown ids are dropped, not stored.

## Learning pipeline

```text
correction.focus_id in catalog
        │
        ▼
increment evidence, store example, set last_seen
        │
        ▼
status becomes active after 3 pieces of evidence in 2 or more sessions
        │
        ▼
next session: topic picker prefers a prompt tagged with that focus
        │
        ▼
successful practice increments success_count
        │
        ▼
priority falls after recent successes so a new pattern can surface
```

Deterministic features (rate, fillers, long pauses) can open a clarity or fluency pattern without a model. Those patterns use fixed coach lines, not a second LLM call, until Phase 9 needs richer wording.

## Storage

One SQLite file. The API is the only writer. See `docs/13-data-model.md`.

## Boundaries

- UI components do not contain pattern rules.
- The LLM client does not import SQLite.
- The learning engine does not import FastAPI or the Whisper model.
- Prompts are files. Python formats a few slots into them.

## What is intentionally missing

No message queue, no user table, no plugin system, no vector store, no pronunciation service in the MVP diagram.
