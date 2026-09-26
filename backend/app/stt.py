import logging
import os
import tempfile
import time
from io import BytesIO
from uuid import uuid4
from wave import Error as WaveError
from wave import open as open_wav

from app import config

logger = logging.getLogger(__name__)

status = "loading"
error_message: str | None = None
_model = None


class TranscriptionError(Exception):
    pass


def load_model() -> None:
    global status, error_message, _model
    status = "loading"
    error_message = None
    try:
        from faster_whisper import WhisperModel

        _model = WhisperModel(
            config.WHISPER_MODEL,
            device="cpu",
            compute_type="int8",
            cpu_threads=config.CPU_THREADS,
            download_root=str(config.HF_HOME),
        )
        status = "ok"
    except Exception as exc:
        _model = None
        status = "error"
        error_message = str(exc)
        logger.exception("Whisper failed to load")


def wav_duration_seconds(wav_bytes: bytes) -> float:
    if len(wav_bytes) < config.WAV_HEADER_BYTES:
        return 0.0
    try:
        with open_wav(BytesIO(wav_bytes), "rb") as wav:
            frames = wav.getnframes()
            rate = wav.getframerate() or config.SAMPLE_RATE
            if rate <= 0:
                return 0.0
            return frames / rate
    except (WaveError, EOFError, ValueError):
        data_bytes = max(0, len(wav_bytes) - config.WAV_HEADER_BYTES)
        return data_bytes / (config.SAMPLE_RATE * 2)


def is_empty_audio(wav_bytes: bytes) -> bool:
    return wav_duration_seconds(wav_bytes) < config.MIN_AUDIO_SECONDS


def transcribe(wav_bytes: bytes) -> tuple[str, int]:
    if _model is None:
        raise TranscriptionError("Speech model is not loaded")
    if config.SAVE_AUDIO:
        config.AUDIO_DIR.mkdir(parents=True, exist_ok=True)
        (config.AUDIO_DIR / f"{uuid4().hex}.wav").write_bytes(wav_bytes)

    started = time.perf_counter()
    fd, path = tempfile.mkstemp(suffix=".wav")
    try:
        os.write(fd, wav_bytes)
        os.close(fd)
        fd = -1
        segments, _info = _model.transcribe(
            path,
            language="en",
            beam_size=1,
            condition_on_previous_text=False,
            vad_filter=True,
            word_timestamps=True,
        )
        text = " ".join(segment.text.strip() for segment in segments).strip()
    except Exception as exc:
        logger.exception("Whisper transcribe failed")
        raise TranscriptionError("Transcription failed") from exc
    finally:
        if fd >= 0:
            os.close(fd)
        try:
            os.unlink(path)
        except OSError:
            pass
    elapsed_ms = int((time.perf_counter() - started) * 1000)
    return text, elapsed_ms
