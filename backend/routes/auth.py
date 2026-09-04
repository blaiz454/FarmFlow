"""
Authentication endpoints.

POST /api/auth/register  - create a new user account
POST /api/auth/login     - exchange credentials for a JWT
POST /api/auth/logout    - stateless "logout" (see note below)
"""

import re
from flask import Blueprint, request, jsonify

from services.db import db
from utils.auth import hash_password, verify_password, generate_token
from models.serializers import serialize_doc

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    errors = {}
    if not name:
        errors["name"] = "Name is required"
    if not email or not EMAIL_RE.match(email):
        errors["email"] = "A valid email is required"
    if len(password) < 8:
        errors["password"] = "Password must be at least 8 characters"

    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    if db.users.find_one({"email": email}):
        return jsonify({"error": "An account with this email already exists"}), 409

    user_doc = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
    }
    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = generate_token(str(result.inserted_id), email)
    user_public = serialize_doc(user_doc)
    user_public.pop("password_hash", None)

    return jsonify({"token": token, "user": user_public}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = db.users.find_one({"email": email})
    if not user or not verify_password(password, user.get("password_hash", "")):
        # Same message for "no user" and "wrong password" so we don't leak
        # which emails are registered.
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(str(user["_id"]), email)
    user_public = serialize_doc(user)
    user_public.pop("password_hash", None)

    return jsonify({"token": token, "user": user_public}), 200


@auth_bp.post("/logout")
def logout():
    """
    JWTs are stateless, so there's no server-side session to destroy here.
    In this small app "logging out" just means the frontend deletes its
    stored token. This endpoint exists for a clean, RESTful client
    contract, and is the natural place to add token blacklisting or
    refresh-token revocation if the app grows.
    """
    return jsonify({"message": "Logged out"}), 200
