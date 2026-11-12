from flask import Blueprint, request, jsonify

from config import Config
from services.execution_service import ExecutionService

execution_bp = Blueprint("execution", __name__)


@execution_bp.route("/start", methods=["POST"])
def start_execution():

    data = request.get_json(silent=True) or {}
    code = data.get("code")

    if not isinstance(code, str) or not code.strip():
        return jsonify({
            "success": False,
            "output": "Please enter some Python code."
        }), 400

    if len(code.encode("utf-8")) > Config.MAX_CODE_SIZE:
        return jsonify({
            "success": False,
            "output": "Code size limit exceeded."
        }), 413

    try:
        result = ExecutionService.start_python(code)
        return jsonify(result), 200

    except Exception as error:
        return jsonify({
            "success": False,
            "output": f"Execution error: {str(error)}"
        }), 500


@execution_bp.route("/input/<session_id>", methods=["POST"])
def send_input(session_id):

    data = request.get_json(silent=True) or {}
    user_input = data.get("input", "")

    if not isinstance(user_input, str):
        return jsonify({
            "success": False,
            "message": "Invalid input."
        }), 400

    success = ExecutionService.send_input(
        session_id,
        user_input
    )

    if not success:
        return jsonify({
            "success": False,
            "message": "Program is no longer accepting input."
        }), 400

    return jsonify({"success": True}), 200


@execution_bp.route("/output/<session_id>", methods=["GET"])
def get_output(session_id):

    result = ExecutionService.get_output(session_id)

    if result is None:
        return jsonify({
            "success": False,
            "message": "Execution session not found."
        }), 404

    return jsonify(result), 200


@execution_bp.route("/stop/<session_id>", methods=["POST"])
def stop_execution(session_id):

    success = ExecutionService.stop_python(session_id)

    if not success:
        return jsonify({
            "success": False,
            "message": "Execution session not found."
        }), 404

    return jsonify({"success": True}), 200


@execution_bp.route("/health", methods=["GET"])
def health_check():

    return jsonify({
        "success": True,
        "message": "PyStrix backend is running."
    }), 200