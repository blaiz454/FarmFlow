"""
CRUD endpoints for livestock, scoped to the authenticated user.

GET    /api/livestock        - list the current user's animals
POST   /api/livestock        - add an animal
GET    /api/livestock/<id>   - fetch one animal
PUT    /api/livestock/<id>   - update an animal
DELETE /api/livestock/<id>   - delete an animal
"""

from flask import Blueprint, request, jsonify, g

from services.db import db
from utils.auth import require_auth
from models.serializers import serialize_doc, to_object_id

livestock_bp = Blueprint("livestock", __name__, url_prefix="/api/livestock")

ALLOWED_STATUS = {"healthy", "sick", "pregnant", "sold", "deceased"}
REQUIRED_FIELDS = ["identifier", "species", "breed", "age"]


def _validate(data: dict) -> dict:
    errors = {}
    for field in REQUIRED_FIELDS:
        if not str(data.get(field, "")).strip():
            errors[field] = "This field is required"
    status = data.get("status", "healthy")
    if status not in ALLOWED_STATUS:
        errors["status"] = f"Status must be one of {sorted(ALLOWED_STATUS)}"
    if "age" in data and str(data.get("age")).strip():
        try:
            float(data["age"])
        except (TypeError, ValueError):
            errors["age"] = "Age must be a number"
    return errors


@livestock_bp.get("")
@require_auth
def list_livestock():
    animals = db.livestock.find({"user_id": to_object_id(g.user_id)}).sort("_id", -1)
    return jsonify([serialize_doc(a) for a in animals]), 200


@livestock_bp.post("")
@require_auth
def create_animal():
    data = request.get_json(silent=True) or {}
    errors = _validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    doc = {
        "user_id": to_object_id(g.user_id),
        "identifier": data["identifier"].strip(),
        "species": data["species"].strip(),
        "breed": data["breed"].strip(),
        "age": float(data["age"]),
        "status": data.get("status", "healthy"),
    }
    result = db.livestock.insert_one(doc)
    doc["_id"] = result.inserted_id
    return jsonify(serialize_doc(doc)), 201


@livestock_bp.get("/<animal_id>")
@require_auth
def get_animal(animal_id):
    oid = to_object_id(animal_id)
    if not oid:
        return jsonify({"error": "Invalid animal id"}), 400
    animal = db.livestock.find_one({"_id": oid, "user_id": to_object_id(g.user_id)})
    if not animal:
        return jsonify({"error": "Animal not found"}), 404
    return jsonify(serialize_doc(animal)), 200


@livestock_bp.put("/<animal_id>")
@require_auth
def update_animal(animal_id):
    oid = to_object_id(animal_id)
    if not oid:
        return jsonify({"error": "Invalid animal id"}), 400

    data = request.get_json(silent=True) or {}
    errors = _validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    update = {
        "identifier": data["identifier"].strip(),
        "species": data["species"].strip(),
        "breed": data["breed"].strip(),
        "age": float(data["age"]),
        "status": data.get("status", "healthy"),
    }
    result = db.livestock.find_one_and_update(
        {"_id": oid, "user_id": to_object_id(g.user_id)},
        {"$set": update},
        return_document=True,
    )
    if not result:
        return jsonify({"error": "Animal not found"}), 404
    return jsonify(serialize_doc(result)), 200


@livestock_bp.delete("/<animal_id>")
@require_auth
def delete_animal(animal_id):
    oid = to_object_id(animal_id)
    if not oid:
        return jsonify({"error": "Invalid animal id"}), 400
    result = db.livestock.delete_one({"_id": oid, "user_id": to_object_id(g.user_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Animal not found"}), 404
    return "", 204
