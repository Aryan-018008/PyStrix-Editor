import os
import sys
import time
import queue
import shutil
import tempfile
import subprocess
import threading
import uuid

from config import Config


class ExecutionService:

    sessions = {}
    sessions_lock = threading.Lock()

    @classmethod
    def start_python(cls, code):

        temp_dir = tempfile.mkdtemp(prefix="pystrix_")
        file_path = os.path.join(temp_dir, "main.py")

        try:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(code)

            process = subprocess.Popen(
                [sys.executable, "-u", "-X", "utf8", file_path],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
                bufsize=1,
                cwd=temp_dir,
                shell=False
            )

            session_id = str(uuid.uuid4())

            session = {
                "process": process,
                "output": queue.Queue(),
                "temp_dir": temp_dir,
                "start_time": time.perf_counter(),
                "readers_done": threading.Event(),
                "output_size": 0,
                "output_limited": False
            }

            with cls.sessions_lock:
                cls.sessions[session_id] = session

            reader = threading.Thread(
                target=cls._read_output,
                args=(session,),
                daemon=True
            )
            reader.start()

            return {
                "success": True,
                "session_id": session_id
            }

        except Exception:
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise

    @staticmethod
    def _read_output(session):

        process = session["process"]

        try:
            while True:
                char = process.stdout.read(1)

                if not char:
                    break

                if session["output_size"] < 100000:
                    session["output"].put(char)
                    session["output_size"] += len(char)

                elif not session["output_limited"]:
                    session["output"].put(
                        "\n[Output limit reached.]"
                    )
                    session["output_limited"] = True

        finally:
            session["readers_done"].set()

    @classmethod
    def send_input(cls, session_id, user_input):

        session = cls.get_session(session_id)

        if not session:
            return False

        process = session["process"]

        if process.poll() is not None:
            return False

        try:
            process.stdin.write(user_input + "\n")
            process.stdin.flush()
            return True

        except (BrokenPipeError, OSError, ValueError):
            return False

    @classmethod
    def get_output(cls, session_id):

        session = cls.get_session(session_id)

        if not session:
            return None

        output_queue = session["output"]
        output_parts = []

        while True:
            try:
                output_parts.append(output_queue.get_nowait())
            except queue.Empty:
                break

        process = session["process"]

        elapsed = time.perf_counter() - session ["start_time"]
        if ( elapsed > Config.MAX_EXECUTION_TIME and process.poll() is None):
            session["timed_out"] = True
            process.kill()

        
        finished = (
            process.poll() is not None
            and session["readers_done"].is_set()
        )

        execution_time = round(
            (time.perf_counter() - session["start_time"]) * 1000,
            2
        )

        result = {
            "success": True,
            "output": "".join(output_parts),
            "finished": finished,
            "exit_code": process.poll(),
            "execution_time": execution_time
        }

        if finished:
            cls.cleanup_session(session_id)

        return result

        if finished and session.get("timed_out"):
            result["output"] += (
              "\nExecution timed out. "
              f"Maximum execution time: {Config.MAX_EXECUTION_TIME} seconds.")

    @classmethod
    def stop_python(cls, session_id):

        session = cls.get_session(session_id)

        if not session:
            return False

        process = session["process"]

        if process.poll() is None:
            process.kill()
        cls.cleanup_session(session_id)

        return True

    @classmethod
    def get_session(cls, session_id):

        with cls.sessions_lock:
            return cls.sessions.get(session_id)

    @classmethod
    def cleanup_session(cls, session_id):

        with cls.sessions_lock:
            session = cls.sessions.pop(session_id, None)

        if session:
            try:
                session["process"].stdout.close()
                session["process"].stdin.close()
            except Exception:
                pass

            shutil.rmtree(
                session["temp_dir"],
                ignore_errors=True
            )