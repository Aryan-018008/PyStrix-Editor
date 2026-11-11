
from flask import Blueprint, request, jsonify

from config import Config
from services.execution_service import ExecutionService

execution_bp = Blueprint("execution", __name__)


@execution_bp.route("/execute", methods=["POST"])
def execute_code():

    data = request.get_json(silent=True) or {}

    code = data.get("code")
    stdin = data.get("stdin", "")

    if not isinstance(code, str) or not code.strip():
        return jsonify({
            "success": False,
            "output": "Please enter some Python code."
        }), 400

    if not isinstance(stdin, str):
        return jsonify({
            "success": False,
            "output": "Invalid input provided."
        }), 400

    if len(code.encode("utf-8")) > Config.MAX_CODE_SIZE:
        return jsonify({
            "success": False,
            "output": "Code size limit exceeded."
        }), 413

    result = ExecutionService.execute_python(code, stdin)

    return jsonify(result), 200


@execution_bp.route("/health", methods=["GET"])
def health_check():

    return jsonify({
        "success": True,
        "message": "PyStrix backend is running."
    }), 200
