from flask import Blueprint, request, jsonify

from service.ai_service import AIService
import json

from flask import Response, stream_with_context


ai_bp = Blueprint("ai", __name__)

ALLOWED_MODES = {"ask", "explain", "debug", "fix"}



@ai_bp.route("/ai", methods=["POST"])
def ai_assistant():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid JSON request."
        }), 400

    user_message = data.get("message", "")
    code = data.get("code", "")
    error = data.get("error", "")
    mode = data.get("mode", "ask")

    if not all(isinstance(value, str) for value in [user_message, code, error, mode]):
        return jsonify({
            "success": False,
            "message": "All request fields must be strings."
        }), 400

    if mode not in ALLOWED_MODES:
        return jsonify({
            "success": False,
            "message": "Invalid AI mode."
        }), 400

    if not user_message.strip():
        return jsonify({
            "success": False,
            "message": "Message cannot be empty."
        }), 400

    if len(user_message) > 10000 or len(code) > 50000 or len(error) > 10000:
        return jsonify({
            "success": False,
            "message": "Request content is too large."
        }), 413

    @stream_with_context
    def generate():

        try:

            for chunk in AIService.stream_response(
                user_message=user_message,
                code=code,
                error=error,
                mode=mode
            ):

                yield f"data: {json.dumps({'chunk': chunk})}\n\n"

            yield "data: [DONE]\n\n"

        except Exception as e:

            print("AI STREAM ERROR:", str(e))

            yield f"data: {json.dumps({'error': 'AI service is currently unavailable.'})}\n\n"

    return Response(
        generate(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )
