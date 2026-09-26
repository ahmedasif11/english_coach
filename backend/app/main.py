import logging
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from app import config, session, stt
from app.schemas import Health, SessionCreated, Timings, TurnResponse
from app.stt import TranscriptionError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

EMPTY_AUDIO = "I didn't catch that. Try again."
STT_FAILED = "Transcription failed. Try that sentence again."
UNKNOWN_SESSION = "Start a new session."


def create_app() -> FastAPI:
    app = FastAPI(title="English Coach", lifespan=lifespan)

    @app.get("/api/health", response_model=Health)
    def health() -> Health:
        return Health(ollama=ollama_status(), stt=stt.status, model=config.WHISPER_MODEL)

    @app.post("/api/sessions", response_model=SessionCreated)
    def start_session() -> SessionCreated:
        if stt.status == "loading":
            raise HTTPException(status_code=503, detail="The speech model is still downloading.")
        if stt.status != "ok":
            raise HTTPException(status_code=503, detail=STT_FAILED)
        created = session.create()
        return SessionCreated(
            id=created.id,
            focus_label=created.focus_label,
            mode=created.mode,
            question=created.question,
        )

    @app.post("/api/sessions/{session_id}/turns", response_model=TurnResponse)
    async def create_turn(session_id: str, request: Request) -> TurnResponse:
        current = session.get_open(session_id)
        if current is None:
            raise HTTPException(status_code=404, detail=UNKNOWN_SESSION)
        wav_bytes = await read_wav(request)
        if stt.is_empty_audio(wav_bytes):
            raise HTTPException(status_code=422, detail=EMPTY_AUDIO)
        try:
            transcript, stt_ms = stt.transcribe(wav_bytes)
        except TranscriptionError:
            raise HTTPException(status_code=503, detail=STT_FAILED) from None
        if not transcript:
            raise HTTPException(status_code=422, detail=EMPTY_AUDIO)
        return TurnResponse(
            transcript=transcript,
            reply="",
            correction=None,
            focus_label=current.focus_label,
            timings_ms=Timings(stt=stt_ms, features=0, llm=0),
        )

    @app.post("/api/sessions/{session_id}/end")
    def end_session(session_id: str) -> JSONResponse:
        ended = session.end(session_id)
        if ended is None:
            raise HTTPException(status_code=404, detail=UNKNOWN_SESSION)
        return JSONResponse({"ok": True})

    return app


@asynccontextmanager
async def lifespan(_app: FastAPI):
    stt.load_model()
    yield


async def read_wav(request: Request) -> bytes:
    content_type = request.headers.get("content-type", "")
    if content_type.startswith("multipart/"):
        form = await request.form()
        upload = form.get("audio") or form.get("file")
        if upload is None or isinstance(upload, str):
            return b""
        return await upload.read()
    return await request.body()


def ollama_status() -> str:
    try:
        response = httpx.get(f"{config.OLLAMA_URL}/api/tags", timeout=0.5)
        return "ok" if response.status_code == 200 else "down"
    except httpx.HTTPError:
        return "down"


app = create_app()
