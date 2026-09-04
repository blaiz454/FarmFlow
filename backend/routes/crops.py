"""
CRUD endpoints for crops, scoped to the authenticated user.

GET    /api/crops        - list the current user's crops
POST   /api/crops        - create a crop
GET    /api/crops/<id>   - fetch one crop
PUT    /api/crops/<id>   - update a crop
DELETE /api/crops/<id>   - delete a crop
"""

from flask import Blueprint, request, jsonify, g

from services.db import db
from utils.auth import require_auth
from models.serializers import serialize_doc, to_object_id

crops_bp = Blueprint("crops", __name__, url_prefix="/api/crops")

ALLOWED_STATUS = {"planned", "planted", "growing", "harvested"}
REQUIRED_FIELDS = ["name", "type", "area", "planting_date", "expected_harvest_date"]


def _validate(data: dict) -> dict:
    errors = {}
    for field in REQUIRED_FIELDS:
        if not str(data.get(field, "")).strip():
            errors[field] = "This field is required"
    status = data.get("status", "planned")
    if status not in ALLOWED_STATUS:
        errors["status"] = f"Status must be one of {sorted(ALLOWED_STATUS)}"
    if "area" in data and str(data.get("area")).strip():
        try:
            float(data["area"])
        except (TypeError, ValueError):
            errors["area"] = "Area must be a number"
    return errors


@crops_bp.get("")
@require_auth
def list_crops():
    crops = db.crops.find({"user_id": to_object_id(g.user_id)}).sort("_id", -1)
    return jsonify([serialize_doc(c) for c in crops]), 200


@crops_bp.post("")
@require_auth
def create_crop():
    data = request.get_json(silent=True) or {}
    errors = _validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    doc = {
        "user_id": to_object_id(g.user_id),
        "name": data["name"].strip(),
        "type": data["type"].strip(),
        "area": float(data["area"]),
        "planting_date": data["planting_date"],
        "expected_harvest_date": data["expected_harvest_date"],
        "status": data.get("status", "planned"),
    }
    result = db.crops.insert_one(doc)
    doc["_id"] = result.inserted_id
    return jsonify(serialize_doc(doc)), 201


@crops_bp.get("/<crop_id>")
@require_auth
def get_crop(crop_id):
    oid = to_object_id(crop_id)
    if not oid:
        return jsonify({"error": "Invalid crop id"}), 400
    crop = db.crops.find_one({"_id": oid, "user_id": to_object_id(g.user_id)})
    if not crop:
        return jsonify({"error": "Crop not found"}), 404
    return jsonify(serialize_doc(crop)), 200


@crops_bp.put("/<crop_id>")
@require_auth
def update_crop(crop_id):
    oid = to_object_id(crop_id)
    if not oid:
        return jsonify({"error": "Invalid crop id"}), 400

    data = request.get_json(silent=True) or {}
    errors = _validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    update = {
        "name": data["name"].strip(),
        "type": data["type"].strip(),
        "area": float(data["area"]),
        "planting_date": data["planting_date"],
        "expected_harvest_date": data["expected_harvest_date"],
        "status": data.get("status", "planned"),
    }
    result = db.crops.find_one_and_update(
        {"_id": oid, "user_id": to_object_id(g.user_id)},
        {"$set": update},
        return_document=True,
    )
    if not result:
        return jsonify({"error": "Crop not found"}), 404
    return jsonify(serialize_doc(result)), 200


@crops_bp.delete("/<crop_id>")
@require_auth
def delete_crop(crop_id):
    oid = to_object_id(crop_id)
    if not oid:
        return jsonify({"error": "Invalid crop id"}), 400
    result = db.crops.delete_one({"_id": oid, "user_id": to_object_id(g.user_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Crop not found"}), 404
    return "", 204
