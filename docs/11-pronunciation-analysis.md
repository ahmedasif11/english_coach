# Pronunciation Analysis

## Decision

The MVP does not score pronunciation.

A transcript is not a pronunciation test. Whisper can be confident and still have substituted a different word than the one that was said. Printing "Pronunciation: 92%" would be a fake measurement.

## What would count as a real result

A later experiment can do this and only this:

1. The app shows a known sentence, for example "Think about that thing."
2. The person reads it.
3. A phoneme recognizer, not Whisper, lists phones it heard.
4. The app compares those phones to the expected phones for that sentence.
5. The UI names a difference, such as "the TH in think was unclear," or it says the check could not tell.
6. There is still no overall percentage unless the tool's own score is documented and the app labels it experimental.

That mode is read-aloud practice. It does not run during free conversation.

## Candidates, not chosen yet

| Tool | Why it is parked |
| --- | --- |
| OpenPronounce | Local and phoneme-level, but it wants PyTorch plus about 2.4 GB of Wav2Vec2 weights. Loading that beside `qwen2.5:3b` on 16 GB is likely to swap. |
| ctc-forced-aligner | Alignment of a known transcript, not by itself a learner pronunciation grade. |
| Whisper `avg_logprob` / no_speech_prob | Useful as a "this clip failed" signal. Not a pronunciation score. |

Phase 10 is a spike: time and memory of one phoneme pass on a 5 second clip, with Ollama unloaded if necessary. If the spike cannot point at a sound, the feature stays out.

## Clarity is separate

Speaking rate, fillers, and pauses are in `docs/12-learning-engine.md` and `docs/07-lld.md`. They describe delivery. They are approximations. They are not pronunciation.
