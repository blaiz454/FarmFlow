"""
CRUD endpoints for farm tasks, scoped to the authenticated user.

GET    /api/tasks        - list the current user's tasks
POST   /api/tasks        - create a task
GET    /api/tasks/<id>   - fetch one task
PUT    /api/tasks/<id>   - update a task
DELETE /api/tasks/<id>   - delete a task
"""

from flask import Blueprint, request, jsonify, g

from services.db import db
from utils.auth import require_auth
from models.serializers import serialize_doc, to_object_id

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

ALLOWED_STATUS = {"pending", "in_progress", "complete"}


def _validate(data: dict) -> dict:
    errors = {}
    if not str(data.get("title", "")).strip():
        errors["title"] = "Title is required"
    if not str(data.get("due_date", "")).strip():
        errors["due_date"] = "Due date is required"
    status = data.get("status", "pending")
    if status not in ALLOWED_STATUS:
        errors["status"] = f"Status must be one of {sorted(ALLOWED_STATUS)}"
    return errors


@tasks_bp.get("")
@require_auth
def list_tasks():
    tasks = db.tasks.find({"user_id": to_object_id(g.user_id)}).sort("_id", -1)
    return jsonify([serialize_doc(t) for t in tasks]), 200


@tasks_bp.post("")
@require_auth
def create_task():
    data = request.get_json(silent=True) or {}
    errors = _validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    doc = {
        "user_id": to_object_id(g.user_id),
        "title": data["title"].strip(),
        "description": (data.get("description") or "").strip(),
        "due_date": data["due_date"],
        "status": data.get("status", "pending"),
    }
    result = db.tasks.insert_one(doc)
    doc["_id"] = result.inserted_id
    return jsonify(serialize_doc(doc)), 201


@tasks_bp.get("/<task_id>")
@require_auth
def get_task(task_id):
    oid = to_object_id(task_id)
    if not oid:
        return jsonify({"error": "Invalid task id"}), 400
    task = db.tasks.find_one({"_id": oid, "user_id": to_object_id(g.user_id)})
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(serialize_doc(task)), 200


@tasks_bp.put("/<task_id>")
@require_auth
def update_task(task_id):
    oid = to_object_id(task_id)
    if not oid:
        return jsonify({"error": "Invalid task id"}), 400

    data = request.get_json(silent=True) or {}
    errors = _validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    update = {
        "title": data["title"].strip(),
        "description": (data.get("description") or "").strip(),
        "due_date": data["due_date"],
        "status": data.get("status", "pending"),
    }
    result = db.tasks.find_one_and_update(
        {"_id": oid, "user_id": to_object_id(g.user_id)},
        {"$set": update},
        return_document=True,
    )
    if not result:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(serialize_doc(result)), 200


@tasks_bp.patch("/<task_id>/complete")
@require_auth
def complete_task(task_id):
    """Convenience endpoint used by the "mark complete" checkbox in the UI."""
    oid = to_object_id(task_id)
    if not oid:
        return jsonify({"error": "Invalid task id"}), 400
    result = db.tasks.find_one_and_update(
        {"_id": oid, "user_id": to_object_id(g.user_id)},
        {"$set": {"status": "complete"}},
        return_document=True,
    )
    if not result:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(serialize_doc(result)), 200


@tasks_bp.delete("/<task_id>")
@require_auth
def delete_task(task_id):
    oid = to_object_id(task_id)
    if not oid:
        return jsonify({"error": "Invalid task id"}), 400
    result = db.tasks.delete_one({"_id": oid, "user_id": to_object_id(g.user_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Task not found"}), 404
    return "", 204
