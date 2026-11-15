
import re

from flask import Blueprint, request, jsonify

from database.db import save_feedback, get_connection


feedback_bp = Blueprint("feedback", __name__)


ALLOWED_CATEGORIES = {
    "Bug Report",
    "Feature Request",
    "General Feedback",
    "Appreciation"
}

ALLOWED_RECOMMENDATIONS = {
    "",
    "Definitely",
    "Maybe",
    "Not yet"
}

EMAIL_PATTERN = re.compile(
    r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
)


def clean_text(value):
    if not isinstance(value, str):
        return ""

    return value.strip()


def error_response(message, status_code=400):
    return jsonify({
        "success": False,
        "message": message
    }), status_code


# ==========================================
# POST: SUBMIT FEEDBACK
# URL: /api/feedback
# ==========================================

@feedback_bp.route("/feedback", methods=["POST"])
def submit_feedback():

    if not request.is_json:
        return error_response(
            "Request must contain JSON data.",
            415
        )

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return error_response("Invalid request data.")

    # Honeypot
    website = clean_text(data.get("website", ""))

    if website:
        return jsonify({
            "success": True,
            "message": "Thank you for your feedback!"
        }), 201

    category = clean_text(data.get("category"))
    name = clean_text(data.get("name", ""))
    email = clean_text(data.get("email", ""))
    subject = clean_text(data.get("subject"))
    message = clean_text(data.get("message"))
    recommendation = clean_text(
        data.get("recommendation", "")
    )

    rating = data.get("rating")

    # CATEGORY
    if category not in ALLOWED_CATEGORIES:
        return error_response(
            "Please select a valid feedback category."
        )

    # RATING
    if isinstance(rating, bool) or not isinstance(rating, int):
        return error_response(
            "Rating must be a number between 1 and 5."
        )

    if not 1 <= rating <= 5:
        return error_response(
            "Rating must be between 1 and 5."
        )

    # NAME
    if len(name) > 80:
        return error_response(
            "Name cannot exceed 80 characters."
        )

    # EMAIL
    if len(email) > 120:
        return error_response(
            "Email cannot exceed 120 characters."
        )

    if email and not EMAIL_PATTERN.match(email):
        return error_response(
            "Please enter a valid email address."
        )

    # SUBJECT
    if not 3 <= len(subject) <= 120:
        return error_response(
            "Subject must contain between 3 and 120 characters."
        )

    # MESSAGE
    if not 10 <= len(message) <= 2000:
        return error_response(
            "Message must contain between 10 and 2000 characters."
        )

    # RECOMMENDATION
    if recommendation not in ALLOWED_RECOMMENDATIONS:
        return error_response(
            "Please select a valid recommendation option."
        )

    feedback_data = {
        "category": category,
        "rating": rating,
        "name": name or None,
        "email": email or None,
        "subject": subject,
        "message": message,
        "recommendation": recommendation or None
    }

    try:
        feedback_id = save_feedback(feedback_data)

        return jsonify({
            "success": True,
            "message": "Your feedback has been submitted successfully.",
            "feedback_id": feedback_id
        }), 201

    except Exception:
        return error_response(
            "Unable to save your feedback right now.",
            500
        )


# ==========================================
# GET: RETRIEVE FEEDBACK LIST
# URL: /api/feedback/list
# ==========================================

@feedback_bp.route("/feedback/list", methods=["GET"])
def get_feedback_list():

    connection = None

    try:
        connection = get_connection()

        rows = connection.execute("""
            SELECT
                id,
                category,
                rating,
                name,
                email,
                subject,
                message,
                recommendation,
                created_at
            FROM feedback
            ORDER BY id DESC
        """).fetchall()

        feedback_list = [
            dict(row) for row in rows
        ]

        return jsonify({
            "success": True,
            "total": len(feedback_list),
            "feedback": feedback_list
        }), 200

    except Exception:
        return error_response(
            "Unable to retrieve feedback.",
            500
        )

    finally:
        if connection:
            connection.close()
