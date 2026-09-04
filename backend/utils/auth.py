"""
Authentication helpers.

This is a deliberately small, educational auth system: passwords are
hashed with bcrypt (never stored in plaintext) and sessions are represented
as short-lived JWTs sent in the `Authorization: Bearer <token>` header.
It is NOT meant to be enterprise-grade — there's no refresh-token rotation,
no rate limiting, no email verification. Good enough to learn the shape of
real auth without the extra complexity.
"""

from functools import wraps
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from flask import request, jsonify, g

from config import config


def hash_password(plain_password: str) -> str:
    """Hash a password with bcrypt. Returns a string safe to store in Mongo."""
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plaintext password against a stored bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except (ValueError, TypeError):
        return False


def generate_token(user_id: str, email: str) -> str:
    """Issue a signed JWT that represents an authenticated session."""
    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=config.JWT_EXPIRES_HOURS),
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm="HS256")


def decode_token(token: str):
    """Decode and validate a JWT. Raises jwt exceptions on failure."""
    return jwt.decode(token, config.JWT_SECRET, algorithms=["HS256"])


def require_auth(f):
    """
    Route decorator that enforces a valid JWT on protected endpoints.

    On success, sets `g.user_id` and `g.user_email` for the route to use.
    On failure, returns a 401 JSON response — it never lets the request
    reach the underlying view.
    """

    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or malformed Authorization header"}), 401

        token = auth_header.split(" ", 1)[1]
        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Session expired, please log in again"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authentication token"}), 401

        g.user_id = payload["sub"]
        g.user_email = payload.get("email")
        return f(*args, **kwargs)

    return wrapper
