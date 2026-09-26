from pydantic import BaseModel


class Health(BaseModel):
    ollama: str
    stt: str
    model: str


class SessionCreated(BaseModel):
    id: str
    focus_label: str
    mode: str
    question: str


class Correction(BaseModel):
    focus_id: str
    heard: str
    better: str
    rule: str
    practice_prompt: str


class Timings(BaseModel):
    stt: int
    features: int
    llm: int


class TurnResponse(BaseModel):
    transcript: str
    reply: str
    correction: Correction | None
    focus_label: str
    timings_ms: Timings
