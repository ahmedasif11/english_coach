from dataclasses import dataclass
from uuid import uuid4

sessions: dict[str, "Session"] = {}


@dataclass
class Session:
    id: str
    focus_label: str = "Past tense"
    mode: str = "diagnostic"
    question: str = "Tell me what you did yesterday."
    ended: bool = False


def create() -> Session:
    session = Session(id=uuid4().hex)
    sessions[session.id] = session
    return session


def get_open(session_id: str) -> Session | None:
    session = sessions.get(session_id)
    if session is None or session.ended:
        return None
    return session


def end(session_id: str) -> Session | None:
    session = sessions.get(session_id)
    if session is None:
        return None
    session.ended = True
    return session
