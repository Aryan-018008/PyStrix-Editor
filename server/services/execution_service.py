
import os
import sys
import time
import tempfile
import subprocess

from config import Config


class ExecutionService:

    @staticmethod
    def execute_python(code, stdin=""):

        start_time = time.perf_counter()

        try:
            with tempfile.TemporaryDirectory(prefix="pystrix_") as temp_dir:

                file_path = os.path.join(temp_dir, "main.py")

                with open(file_path, "w", encoding="utf-8") as file:
                    file.write(code)

                result = subprocess.run(
                    [sys.executable, file_path],
                    input=stdin,
                    capture_output=True,
                    text=True,
                    cwd=temp_dir,
                    timeout=Config.MAX_EXECUTION_TIME,
                    shell=False,
                    encoding="utf-8",
                    errors="replace"
                )

                execution_time = round(
                    (time.perf_counter() - start_time) * 1000, 2
                )

                output = result.stdout or ""

                if result.stderr:
                    output += result.stderr

                if not output:
                    output = (
                        "Program executed successfully."
                        if result.returncode == 0
                        else "Program execution failed."
                    )

                # Keep the response manageable.
                output = output[:100000]

                return {
                    "success": result.returncode == 0,
                    "output": output,
                    "execution_time": execution_time,
                    "exit_code": result.returncode
                }

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "Execution timed out. Maximum allowed time is 5 seconds.",
                "execution_time": round(
                    (time.perf_counter() - start_time) * 1000, 2
                ),
                "exit_code": None
            }

        except Exception as error:
            return {
                "success": False,
                "output": f"Execution error: {str(error)}",
                "execution_time": None,
                "exit_code": None
            }
