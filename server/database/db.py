
import sqlite3
from pathlib import Path
from datetime import datetime, timezone


# Database directory and file
BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "pystrix.db"


def get_connection():
    """
    Create and return a SQLite database connection.
    """

    DATABASE_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    connection = sqlite3.connect(
        DATABASE_PATH,
        timeout=10
    )

    connection.row_factory = sqlite3.Row

    return connection


def init_db():
    """
    Initialize the database and create required tables.
    """

    connection = get_connection()

    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                category TEXT NOT NULL,
                rating INTEGER NOT NULL,

                name TEXT,
                email TEXT,

                subject TEXT NOT NULL,
                message TEXT NOT NULL,

                recommendation TEXT,

                created_at TEXT NOT NULL
            )
        """)

        connection.commit()

    finally:
        connection.close()


def save_feedback(feedback_data):
    """
    Save validated feedback and return its database ID.
    """

    connection = get_connection()

    try:
        created_at = datetime.now(
            timezone.utc
        ).isoformat(timespec="seconds")

        cursor = connection.execute("""
            INSERT INTO feedback (
                category,
                rating,
                name,
                email,
                subject,
                message,
                recommendation,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            feedback_data["category"],
            feedback_data["rating"],
            feedback_data["name"],
            feedback_data["email"],
            feedback_data["subject"],
            feedback_data["message"],
            feedback_data["recommendation"],
            created_at
        ))

        connection.commit()

        return cursor.lastrowid

    finally:
        connection.close()
