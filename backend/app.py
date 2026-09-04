"""
FarmFlow backend entry point.

Run locally with:
    python app.py

Production:
    gunicorn app:app

This registers all route blueprints, configures CORS from environment
variables, initializes MongoDB indexes, and provides consistent JSON
responses for API errors.
"""

from flask import Flask, jsonify, g
from flask_cors import CORS

from config import config
from services.db import db, init_indexes
from utils.auth import require_auth
from models.serializers import serialize_doc, to_object_id

from routes.auth import auth_bp
from routes.crops import crops_bp
from routes.livestock import livestock_bp
from routes.tasks import tasks_bp


# Validate required configuration before starting the application.
config.validate()

app = Flask(__name__)

# CORS origins are supplied through the environment.
# Example:
# CORS_ORIGINS=http://localhost:5173,https://YOUR-FRONTEND-DOMAIN
CORS(
    app,
    origins=config.CORS_ORIGINS,
    supports_credentials=True,
)


# --- Register API blueprints ---------------------------------------------

app.register_blueprint(auth_bp)
app.register_blueprint(crops_bp)
app.register_blueprint(livestock_bp)
app.register_blueprint(tasks_bp)


# --- Database startup -----------------------------------------------------

try:
    init_indexes()
except Exception as exc:  # pragma: no cover - startup diagnostic only
    print(
        "\n[FarmFlow] Could not connect to MongoDB at startup.\n"
        f"  Underlying error: {exc}\n\n"
        "  Check that MONGO_URI points to a reachable MongoDB "
        "instance or MongoDB Atlas cluster.\n"
    )
    raise SystemExit(1)


# --- Health check --------------------------------------------------------

@app.get("/api/health")
def health():
    """
    Simple liveness check used by deployment platforms and monitoring tools.
    """
    return jsonify({"status": "ok"}), 200


# --- Authenticated user --------------------------------------------------

@app.get("/api/auth/me")
@require_auth
def me():
    """
    Return the currently authenticated user.
    Used by the frontend to restore the authenticated session.
    """
    user = db.users.find_one({"_id": to_object_id(g.user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    public = serialize_doc(user)
    public.pop("password_hash", None)

    return jsonify(public), 200


# --- Consistent JSON error handling -------------------------------------

@app.errorhandler(404)
def not_found(_err):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(405)
def method_not_allowed(_err):
    return jsonify({"error": "Method not allowed"}), 405


@app.errorhandler(500)
def server_error(_err):
    """
    Never expose stack traces or internal application details to clients.
    The actual exception remains available in server logs.
    """
    return jsonify({"error": "Internal server error"}), 500


# --- Local development server -------------------------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=config.PORT,
        debug=not config.IS_PRODUCTION,
    )