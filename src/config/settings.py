from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Flask configuration
FLASK_CONFIG = {
    'HOST': '0.0.0.0',
    'PORT': 3000,
    'DEBUG': True
}

# CORS configuration
CORS_CONFIG = {
    "origins": "*",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}