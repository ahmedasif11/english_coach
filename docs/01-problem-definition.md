# Problem Definition

Cloud voice assistants can hold a conversation. They are a poor default English teacher for this use, because the person must keep steering them, they forget recurring mistakes, they explain too much, and they cost money to use every day.

## Jobs the app has to do

1. Start without a configuration ritual.
2. Stay on English improvement when the talk drifts.
3. Choose the next practice target from evidence, not from a menu.
4. Correct one or two problems, then return to speaking.
5. Remember a mistake pattern across sessions.
6. Respond fast enough that speaking still feels like speaking.
7. Run on this laptop indefinitely without an API bill.
8. Keep audio and transcripts on the machine.

## Concept changes after analysis

These changes keep the original goal and remove work that does not help.

| Original impulse | Decision |
| --- | --- |
| Let the model plan the curriculum | A small learning engine plans focus, topics, and when to correct. The model only speaks and explains. |
| Score every skill from 0 to 1 | Store evidence: counts, examples, recency, and whether practice stuck. Show a focus name, not a percentage. |
| Analyze pronunciation like grammar | Pronunciation needs a different model and a known target sentence. It is a later, labeled experiment. Conversation mode will not show a pronunciation percent. |
| Send every step to the LLM | Measure rate, pauses, and fillers in code. Call the model once per turn. |
| Pick topics with the model | Use a tagged list of prompts. The learning engine picks the tag. |
| Build Next.js plus several services | One local web UI and one FastAPI process. |
| Correct every sentence | Skip acknowledgements and recently corrected patterns. Cap visible feedback at two items. |

## The hard limit

Whisper-style recognizers often transcribe learner grammar as correct English. Studies of non-native speech found high rates of morphological "correction" inside the transcript, including with Whisper. See `docs/10-speech-pipeline.md`.

The coach can teach errors that remain in the text, such as a wrong word or a confused construction the recognizer did not rewrite. It cannot honestly claim it heard every grammar mistake. The product must show the transcript it used, so the person can see when the text does not match what they said.

## Non-goals

Paid APIs, accounts, cloud sync, multiple learners, exam scoring, and decorative analytics.
