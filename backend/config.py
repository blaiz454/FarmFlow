"""
Centralized configuration for the FarmFlow backend.

Configuration is supplied through environment variables so the same
application can run in development, staging, and production without
changing source code.

For local development, variables can be placed in backend/.env.

For production, the deployment platform should provide the variables
through its environment-variable configuration.
"""

import os
from dotenv import load_dotenv


# Load backend/.env during local development.
# Production platforms normally inject environment variables directly.
load_dotenv()


class Config:

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------

    MONGO_URI = os.environ.get(
        "MONGO_URI",
        "mongodb://localhost:27017/farmflow",
    )


    # ------------------------------------------------------------------
    # Authentication
    # ------------------------------------------------------------------

    JWT_SECRET = os.environ.get("JWT_SECRET")

    JWT_EXPIRES_HOURS = int(
        os.environ.get("JWT_EXPIRES_HOURS", "24")
    )


    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------

    # Multiple origins can be supplied as a comma-separated value.
    #
    # Development:
    # CORS_ORIGINS=http://localhost:5173
    #
    # Production example:
    # CORS_ORIGINS=https://YOUR-FRONTEND-DOMAIN
    #
    # If both are needed:
    # CORS_ORIGINS=http://localhost:5173,https://YOUR-FRONTEND-DOMAIN

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            "CORS_ORIGINS",
            "http://localhost:5173",
        ).split(",")
        if origin.strip()
    ]


    # ------------------------------------------------------------------
    # Application
    # ------------------------------------------------------------------

    FLASK_ENV = os.environ.get(
        "FLASK_ENV",
        "development",
    ).lower()

    PORT = int(
        os.environ.get("PORT", "5000")
    )

    IS_PRODUCTION = FLASK_ENV == "production"


    # ------------------------------------------------------------------
    # Configuration validation
    # ------------------------------------------------------------------

    @classmethod
    def validate(cls):
        """
        Validate required production configuration before startup.

        The application should fail immediately if required secrets or
        database configuration are missing rather than starting in a
        broken state.
        """

        missing = []

        if not cls.JWT_SECRET:
            missing.append("JWT_SECRET")

        if not cls.MONGO_URI:
            missing.append("MONGO_URI")

        if not cls.CORS_ORIGINS:
            missing.append("CORS_ORIGINS")

        if missing:
            raise RuntimeError(
                "Missing required environment variables: "
                + ", ".join(missing)
                + ". Check backend/.env for local development or "
                  "the deployment platform's environment variables "
                  "for production."
            )


config = Config