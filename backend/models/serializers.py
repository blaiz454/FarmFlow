"""
Small helpers for turning MongoDB documents (which contain ObjectId and
datetime objects) into plain JSON-serializable dicts, and back.
"""

from bson import ObjectId
from bson.errors import InvalidId


def serialize_doc(doc: dict) -> dict:
    """Convert a Mongo document into a JSON-safe dict with `id` as a string."""
    if doc is None:
        return None
    out = dict(doc)
    out["id"] = str(out.pop("_id"))
    if "user_id" in out and isinstance(out["user_id"], ObjectId):
        out["user_id"] = str(out["user_id"])
    return out


def to_object_id(id_str: str):
    """Safely convert a string to an ObjectId, or None if it's not valid."""
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None
