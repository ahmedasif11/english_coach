# UI

One page. No navigation, no charts, no settings.

## Layout

```text
English Coach
Today: Past tense

[ Start speaking ]

Coach
Tell me what you did yesterday.

You
I go there yesterday.

Heard
I go there yesterday.

Better
I went there yesterday.

Use the past form because this happened yesterday.

Say: I went there yesterday.
```

While recording, the button reads "Listening…". While the server works, it reads "Working…". End sits beside Start once a session exists.

## Behavior

- The latest turn is visible without scrolling past a long history. Older turns stay on the page in a short list.
- The correction block is absent when `correction` is null.
- Approximate clarity notes, when they exist, use the word "Approximate".
- Coach speech can be stopped by starting the next recording.
- Text appears even if speech synthesis fails. A small line says "Sound is off" and the session continues.
- No percentages, streaks, or skill bars.

## Visual scope

Readable type, clear buttons, enough contrast. No animation work. A narrow window should stack the correction under the transcript. Check that once when the UI exists.

## Copy

Use the product sentences from `docs/04-user-flow.md` and the error sentences from `docs/07-lld.md`. Do not paraphrase them into joke text or a mascot.
