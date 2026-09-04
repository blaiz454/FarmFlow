"""
A single, shared MongoDB connection for the whole app.

Flask apps can end up creating a new MongoClient per request if you're not
careful, which is wasteful — pymongo's client already pools connections
internally, so we create it once at import time and reuse it everywhere.
"""

from pymongo import MongoClient, ASCENDING
from config import config

_client = MongoClient(config.MONGO_URI, serverSelectionTimeoutMS=5000)
db = _client.get_default_database()


def init_indexes():
    """
    Create indexes that keep common queries fast and enforce basic
    data integrity. Safe to call every startup — MongoDB no-ops if an
    identical index already exists.
    """
    db.users.create_index([("email", ASCENDING)], unique=True)
    db.crops.create_index([("user_id", ASCENDING)])
    db.livestock.create_index([("user_id", ASCENDING)])
    db.tasks.create_index([("user_id", ASCENDING)])
