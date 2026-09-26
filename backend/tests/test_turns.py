from io import BytesIO
from wave import open as open_wav

import pytest
from fastapi.testclient import TestClient

from app import session, stt
from app.main import app

EMPTY_AUDIO = "I didn't catch that. Try again."
UNKNOWN_SESSION = "Start a new session."


def wav_bytes(seconds: float) -> bytes:
    frames = int(16_000 * seconds)
    buffer = BytesIO()
    with open_wav(buffer, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(16_000)
        wav.writeframes(b"\x00\x00" * frames)
    return buffer.getvalue()


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch) -> TestClient:
    session.sessions.clear()
    stt.status = "ok"
    stt.error_message = None
    monkeypatch.setattr(stt, "load_model", lambda: None)
    monkeypatch.setattr(stt, "transcribe", lambda _wav: ("hello from the test", 8))
    with TestClient(app) as test_client:
        yield test_client


def start_session(client: TestClient) -> str:
    response = client.post("/api/sessions")
    assert response.status_code == 200, response.text
    return response.json()["id"]


def test_health_reports_stt_when_ollama_is_down(client: TestClient) -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["stt"] == "ok"
    assert body["model"] == "base.en"
    assert body["ollama"] in {"ok", "down"}


def test_empty_wav_returns_catch_message(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    session_id = start_session(client)

    def fail_if_called(_wav: bytes) -> tuple[str, int]:
        raise AssertionError("empty audio should not call Whisper")

    monkeypatch.setattr(stt, "transcribe", fail_if_called)
    response = client.post(
        f"/api/sessions/{session_id}/turns",
        content=wav_bytes(0),
        headers={"content-type": "audio/wav"},
    )
    assert response.status_code == 422
    assert response.json()["detail"] == EMPTY_AUDIO


def test_short_wav_returns_catch_message(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    session_id = start_session(client)

    def fail_if_called(_wav: bytes) -> tuple[str, int]:
        raise AssertionError("short audio should not call Whisper")

    monkeypatch.setattr(stt, "transcribe", fail_if_called)
    response = client.post(
        f"/api/sessions/{session_id}/turns",
        content=wav_bytes(0.1),
        headers={"content-type": "audio/wav"},
    )
    assert response.status_code == 422
    assert response.json()["detail"] == EMPTY_AUDIO


def test_unknown_session_id(client: TestClient) -> None:
    response = client.post(
        "/api/sessions/missing/turns",
        content=wav_bytes(1),
        headers={"content-type": "audio/wav"},
    )
    assert response.status_code == 404
    assert response.json()["detail"] == UNKNOWN_SESSION


def test_turn_returns_transcript_only(client: TestClient) -> None:
    session_id = start_session(client)
    response = client.post(
        f"/api/sessions/{session_id}/turns",
        content=wav_bytes(1),
        headers={"content-type": "audio/wav"},
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["transcript"] == "hello from the test"
    assert body["reply"] == ""
    assert body["correction"] is None
    assert body["timings_ms"]["stt"] == 8
