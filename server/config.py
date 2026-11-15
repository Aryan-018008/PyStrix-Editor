import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")


class Config:
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    MAX_CODE_SIZE = int(os.getenv("MAX_CODE_SIZE", 50000))
    MAX_EXECUTION_TIME = int(os.getenv("MAX_EXECUTION_TIME", 120))