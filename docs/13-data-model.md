# Data Model

SQLite file: `data/coach.db`. Times are ISO-8601 UTC text.

## Tables

### learner

One row, `id = 1`.

| Column | Type | Notes |
| --- | --- | --- |
| id | integer | Always 1 |
| diagnostic_complete | integer | 0 or 1 |
| difficulty | text | Ladder name |
| created_at | text | |
| updated_at | text | |

### pattern

| Column | Type | Notes |
| --- | --- | --- |
| id | text | Catalog id, primary key |
| domain | text | `grammar`, `clarity`, `fluency`, `vocabulary` |
| label | text | UI text, from the catalog |
| evidence_count | integer | |
| success_count | integer | Practice retries that matched |
| severity | text | `low`, `medium`, `high` |
| status | text | `watching`, `active`, `resting` |
| session_ids | text | JSON array, used to test the two-session rule |
| last_seen | text | |
| last_practiced | text | |
| last_example | text | Short quote |
| updated_at | text | |

`session_ids` stays small because only recent ids are required. Cap the array at 20.

### session

| Column | Type | Notes |
| --- | --- | --- |
| id | text | UUID |
| started_at | text | |
| ended_at | text | Null until end |
| mode | text | `diagnostic` or `conversation` |
| focus_id | text | Nullable |
| difficulty | text | Copied at start |

### turn

| Column | Type | Notes |
| --- | --- | --- |
| id | integer | |
| session_id | text | |
| user_text | text | Transcript |
| assistant_text | text | Reply only, not the correction card |
| correction_json | text | Nullable |
| prompt_id | text | Question that was asked |
| wpm | real | Nullable until features exist |
| pause_count | integer | |
| filler_count | integer | |
| duration_ms | integer | |
| stt_ms | integer | |
| llm_ms | integer | |
| created_at | text | |

### prompt_use

| Column | Type |
| --- | --- |
| prompt_id | text |
| session_id | text |
| used_at | text |

## What is not stored

- Raw audio, by default
- Embeddings
- A second copy of the profile in JSON
- User accounts

## Backup

Copy `data/coach.db` while the server is stopped. That file is the whole memory of the coach.

## Example pattern row

```json
{
  "id": "past_tense",
  "domain": "grammar",
  "label": "Past tense",
  "evidence_count": 4,
  "success_count": 1,
  "severity": "high",
  "status": "active",
  "session_ids": ["a1", "b2"],
  "last_seen": "2026-09-26T07:00:00Z",
  "last_example": "I go there yesterday."
}
```

The UI shows `label` and `last_example`. It does not show `evidence_count`.
