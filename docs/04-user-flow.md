# User Flow

## First launch

```text
Open the page
  → health check
  → if Ollama or the speech model is missing, show one recovery message and stop
  → Start
  → five short diagnostic prompts, one at a time
  → corrections only when a real issue is in the transcript
  → save profile
  → normal session can continue or end
```

Diagnostic prompts are fixed:

1. Tell me a little about yourself.
2. Tell me about your university or your work.
3. What did you do last weekend?
4. Describe something you learned recently.
5. Tell me about something you enjoy.

That is the whole diagnostic. There is no score screen.

## Later launch

```text
Open the page
  → show today's focus in one line, or "general conversation" when no pattern is active
  → Start
  → coach asks one question chosen for that focus
  → person speaks
  → transcript, optional correction, short reply
  → person practices the correction if one was given
  → next question
  → End
  → profile saved
```

## One turn

```text
Press or the app is already listening
  → person talks
  → silence ends the utterance
  → "Transcribing" until text exists
  → transcript appears immediately
  → coach text streams in
  → if a correction exists, show it under the turn
  → practice line is spoken by the user before the next new question
```

The user can skip practice with "continue". Skipping is stored as not successful. It does not delete the pattern.

## Practice burst

When a pattern is recurring, the app asks up to three focused prompts, then returns to a normal question. The user does not switch modes by hand.

Example for past tense: "What did you do yesterday?"

## End

Ending the session writes the profile and closes the microphone. Refreshing the page does not delete history.

## Empty and bad audio

- Silence or noise with no words: "I didn't catch that. Try again."
- Very short audio: same message, no model call.
- Recognizer failure: "Transcription failed. Try that sentence again."
