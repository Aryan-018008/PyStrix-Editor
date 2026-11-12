
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from routes.execution import execution_bp


def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)
    print("MAX EXECUTION TIME:", Config.MAX_EXECUTION_TIME)


    # Allow the local frontend to communicate with Flask.
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "http://127.0.0.1:5501",
                "http://localhost:5501",
                "http://127.0.0.1:5000",
                "http://localhost:5000"
            ]
        }
    })

    app.register_blueprint(
        execution_bp,
        url_prefix="/api"
    )

    @app.route("/")
    def home():
        return jsonify({
            "message": "Welcome to PyStrix API",
            "status": "running"
        })

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "message": "API endpoint not found."
        }), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=Config.DEBUG
    )
