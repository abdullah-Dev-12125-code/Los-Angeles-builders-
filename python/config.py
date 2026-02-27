"""Application configuration for Los Santos Builders."""

import os
from typing import Dict

# Environment
ENV = os.getenv("ENVIRONMENT", "development")
DEBUG = ENV == "development"

# Flask API Configuration
FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))
FLASK_DEBUG = DEBUG

# Dash Configuration
DASH_HOST = os.getenv("DASH_HOST", "0.0.0.0")
DASH_PORT = int(os.getenv("DASH_PORT", 8050))
DASH_DEBUG = DEBUG

# CORS Settings
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

# Branding Colors
BRAND_COLORS: Dict[str, str] = {
    "primary": "#0F6EEB",        # Primary Blue
    "secondary": "#1E3B8A",      # Dark Blue
    "success": "#10B981",        # Green
    "danger": "#EF4444",         # Red
    "warning": "#F59E0B",        # Orange
    "info": "#3B82F6",           # Light Blue
    "light": "#F3F4F6",          # Light Gray
    "dark": "#1F2937",           # Dark Gray
}

# Application Settings
APP_NAME = "Los Santos Builders Analytics"
APP_VERSION = "1.0.0"
COMPANY_NAME = "Los Santos Builders"

# API Settings
API_TIMEOUT = int(os.getenv("API_TIMEOUT", 30))
API_MAX_REQUESTS = int(os.getenv("API_MAX_REQUESTS", 1000))

# Dashboard Settings
ITEMS_PER_PAGE = int(os.getenv("ITEMS_PER_PAGE", 20))
REFRESH_INTERVAL = int(os.getenv("REFRESH_INTERVAL", 5))  # seconds

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FILE = os.getenv("LOG_FILE", "logs/app.log")

# Database Configuration (for future use)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///los_santos.db")
DATABASE_ECHO = DEBUG

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
JWT_SECRET = os.getenv("JWT_SECRET", "your-jwt-secret-change-in-production")

# Feature Flags
FEATURES = {
    "analytics": True,
    "real_time_updates": False,
    "data_export": True,
    "email_notifications": False,
}

def get_config():
    """Get current configuration as dictionary."""
    return {
        "env": ENV,
        "debug": DEBUG,
        "flask_host": FLASK_HOST,
        "flask_port": FLASK_PORT,
        "dash_host": DASH_HOST,
        "dash_port": DASH_PORT,
        "app_name": APP_NAME,
        "app_version": APP_VERSION,
        "company_name": COMPANY_NAME,
    }


def log_config():
    """Log current configuration (safe version without secrets)."""
    config = get_config()
    print("=" * 50)
    print(f"Application Configuration ({ENV})")
    print("=" * 50)
    for key, value in config.items():
        print(f"{key}: {value}")
    print("=" * 50)
