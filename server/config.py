
import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    MAX_CODE_SIZE = int(
        os.getenv("MAX_CODE_SIZE", 50000)
    )

    MAX_EXECUTION_TIME = int(
        os.getenv("MAX_EXECUTION_TIME", 5)
    )
