import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODELS = ROOT / ".models"
HF_HOME = Path(os.environ.get("HF_HOME", MODELS / "hf"))
HF_HOME.mkdir(parents=True, exist_ok=True)
os.environ["HF_HOME"] = str(HF_HOME)

WHISPER_MODEL = os.environ.get("COACH_WHISPER_MODEL", "base.en")
CPU_THREADS = int(os.environ.get("COACH_CPU_THREADS", "6"))
OLLAMA_URL = os.environ.get("COACH_OLLAMA_URL", "http://127.0.0.1:11434")
SAVE_AUDIO = os.environ.get("COACH_SAVE_AUDIO", "").lower() in {"1", "true", "yes"}
AUDIO_DIR = ROOT / "data" / "audio"
MIN_AUDIO_SECONDS = 0.25
SAMPLE_RATE = 16_000
WAV_HEADER_BYTES = 44
