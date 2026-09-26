# AI Design

The model is a speaker and a sentence editor. It is not the memory and not the scheduler.

## Calls

| Situation | Calls |
| --- | --- |
| Normal turn | 1 chat completion |
| Broken JSON | 1 extra repair completion, then stop |
| Health check | Ollama HTTP tags, no generation |
| Topic selection | 0. Questions come from `topics.py` |
| Profile update | 0. SQL from the validated focus id |
| Words per minute, fillers | 0 |

## Prompt file

`prompts/turn.txt` is short. Slots:

- `mode`
- `question`
- `focus_id` or `none`
- `correction_allowed` yes or no
- `history` last four exchanges, each line clipped
- `transcript`

Instructions in the file, not repeated in Python:

- You are an English speaking coach. The user must talk more than you.
- `reply` is at most two sentences. End with one question unless `mode` is a correction retry.
- Use simple spoken English. Do not give a lesson unless a correction is present.
- If `correction_allowed` is no, `correction` is null.
- Correct only the single most useful problem in the transcript.
- `heard` must be copied from the transcript.
- `rule` is one sentence.
- `focus_id` must be one of the catalog ids or there is no correction.
- Do not mention being an AI, and do not comment on accent.

The catalog in the prompt matches `learning.py`. If the catalog changes, change both.

## Catalog passed to the model

MVP grammar ids:

| id | Meaning |
| --- | --- |
| `past_tense` | Past time said with a present verb |
| `present_simple_s` | Missing -s on he/she/it |
| `articles` | a/an/the missing or wrong |
| `prepositions` | Wrong or missing preposition |
| `subject_verb_agreement` | Verb does not match the subject, other than the -s case |
| `word_form` | Right idea, wrong form of the word |
| `missing_word` | A word is missing and the sentence breaks |
| `sentence_structure` | Order or clause shape is hard to follow |
| `vocabulary` | A clearer common word exists, and only when the word blocks understanding |

Do not add ids because a single sentence was interesting. `vocabulary` is easy to overuse. The prompt says to prefer grammar when both exist.

## History

Send the question and the last four pairs. Do not send the whole profile JSON. Send one line: `Current focus: past tense` or `Current focus: none`.

Diagnostic mode adds: ask nothing new; the server supplies the next diagnostic question in `question`. The reply should acknowledge in one sentence and may correct. If the model adds its own question, `session.py` replaces it with the next fixed prompt.

## Difficulty

`learner.difficulty` is chosen by the learning engine and changes which topic list is eligible. The model is told the level in one word (`simple`, `conversation`, `extended`, `opinion`, `story`, `professional`) so wording matches. It does not choose the level.

## What the model must not decide

- Which pattern is today's focus
- Whether the user has improved over weeks
- Pronunciation grades
- Session start and end
- To call tools or browse

There are no tools in the MVP request.
