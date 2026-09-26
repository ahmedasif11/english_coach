# Requirements

## Must have for the MVP

1. One screen. Start speaking is the primary action.
2. First run uses a short fixed diagnostic. Later runs skip it.
3. Microphone audio stays on this machine for transcription.
4. The coach replies in one or two short sentences and asks one question.
5. When a useful grammar issue is visible in the transcript, show the heard line, a better line, and one short rule.
6. Ask the person to say the better line, then continue.
7. Store the pattern. A pattern seen across sessions becomes the next focus.
8. Choose the next question from that focus without asking what to study.
9. The app runs after setup with no paid API and no account.
10. Failures say what to start or allow, in plain language.

## Should have soon after the MVP loop works

- Clarity and fluency notes from duration, pauses, and fillers, labeled as approximations.
- A practice burst of a few prompts when a pattern is recurring.
- Difficulty that moves forward after cleaner sessions.
- Latency timestamps for each stage.

## Later, only if the method is honest

- Pronunciation practice on a sentence the app already knows.
- Piper, if the Windows voice is not good enough.
- A larger local model, only after a measured 3B run is too weak and still fast enough.

## Out of scope

- Accounts, sync, multiple users
- Exam scores and percentage dashboards
- User-authored grammar rules
- Mobile apps
- Always-on listening outside a session

## Constraints

- Windows, this CPU, 16 GB RAM, no NVIDIA GPU
- Model files on `D:`
- Coach text is shorter than the user's speech over a session
- At most two visible issues per turn
- Learning priorities are code, not a free-form model plan

## Acceptance for the MVP loop

- A second session, with the server restarted, still knows a pattern saved in the first session.
- A turn that is only "yes" or "okay" does not produce a grammar lecture.
- With Ollama stopped, the UI says to start Ollama.
- With the microphone denied, the UI says how to allow it.
- No screen shows an unsupported pronunciation percentage.
