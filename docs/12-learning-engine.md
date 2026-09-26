# Learning Engine

The learning engine is ordinary Python. It picks a focus and a question. It updates counts when the turn response carries a catalog id.

## Learner state

One learner row. Fields that matter:

- `diagnostic_complete`
- `difficulty` on the ladder below
- patterns, each with evidence, successes, severity, status, last seen, last practiced, last example, and the session ids that contributed evidence

There is no mastery percentage.

## Status

| Status | Rule |
| --- | --- |
| `watching` | Fewer than 3 evidences, or all evidences in one session |
| `active` | 3 or more evidences from at least 2 sessions, and priority still high |
| `resting` | Two recent sessions practiced it with success, or the user has not shown it for 30 days |

Resting patterns can return to `active` when a new evidence arrives.

Severity is set by the catalog, not the model. Tense and agreement start at `high`. Articles and vocabulary start at `medium`. The model does not send severity.

## Focus selection

At session start:

1. If diagnostic is incomplete, mode is `diagnostic` and the focus label is "Getting to know your English".
2. Else take the highest-priority `active` pattern.
3. If none are `active`, take the highest `watching` pattern only as a soft bias on topics. The focus label stays "Conversation".
4. If a pattern was the focus of the last two sessions, skip it once so practice does not freeze on one item.

During a session, do not change the focus every turn. A new pattern found mid-session is stored and can win next time.

## Practice burst

If the session focus is `active`, the first three questions come from that pattern's practice list. Then the engine uses conversation prompts that still carry the tag when possible. After three questions, a turn without an error does not extend the burst.

## Topics

Each prompt has an id, a minimum difficulty, and zero or more focus tags.

Examples:

| id | Min difficulty | Tags | Prompt |
| --- | --- | --- | --- |
| `weekend` | simple | past_tense | What did you do last weekend? |
| `yesterday` | simple | past_tense | What did you do yesterday? |
| `daily` | simple | present_simple_s | What does a normal morning look like for you? |
| `university` | simple | — | What are you studying, or what work do you do? |
| `explain` | conversation | sentence_structure | Explain something you understand well, in a few sentences. |
| `opinion` | opinion | — | Do you prefer studying alone or with other people? Why? |
| `story` | story | past_tense | Tell me about a trip or a day you still remember. |
| `interview` | professional | — | Tell me about a project you worked on and what you did. |

Selection:

- Eligible prompts must be at or below the current difficulty.
- Prefer a tag match with the session focus.
- Do not repeat a prompt id used in the last three sessions.
- If the list is empty, use a general prompt.

The model may acknowledge the user's last answer. It must not replace the chosen question. If it does, the server appends the chosen question.

## Difficulty ladder

`simple → conversation → extended → opinion → story → professional`

Move up one step when two finished sessions in a row have no `active` pattern that was created or reinforced, and median words per turn is at least 25. Move down one step when two sessions in a row have median rate under 60 words per minute or the user often stops under 5 words. This is a heuristic so questions stay speakable. It is not a CEFR level.

## Diagnostic

Five fixed prompts in order. Corrections still update patterns. At the end, `diagnostic_complete` is true even if no patterns were found. A quiet diagnostic means the next session is ordinary conversation, not an error.

## Correction budget

- At most one correction object per turn.
- No correction on the immediate next turn after one was shown, unless the user asks "why?".
- "Why?" is the only MVP request that may expand the rule. The server detects that word and sets a flag so the reply may be up to four sentences. Still one call.

## Clarity and fluency patterns

Added in Phase 9, same table, different source:

| id | Approximate trigger |
| --- | --- |
| `clarity.fast_speech` | over 190 words per minute on a turn with at least 15 words |
| `clarity.fillers` | 4 or more filler hits in one turn |
| `fluency.long_pauses` | 5 or more gaps over 0.8 seconds |

The coach line for these is a template, for example "Try the same idea in a shorter sentence." They do not pretend to measure intelligibility in a scientific sense. The UI prefix is "Approximate:".

## Vocabulary

A vocabulary correction may be stored under `vocabulary`. It becomes `active` with the same evidence rule. The practice prompt should ask the person to answer again using the better word, not to recite a word list.
