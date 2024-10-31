from flask import Blueprint, jsonify, request
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from ..services.data_service import handle_upload
import os
import json
from datetime import datetime, timedelta

api = Blueprint('api', __name__)

# Cache for access token
token_cache = {
    'token': None,
    'expiry': None
}

@api.route('/connect', methods=['POST', 'OPTIONS'])
def handle_connection():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    client_id = request.json.get('client_id')
    if not client_id:
        return jsonify({"error": "Missing client_id"}), 400
    
    try:
        return jsonify({"status": "connected", "client_id": client_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/rat-locations')
def get_rat_locations():
    try:
        with open('data/mastomys_natalensis_locations.geojson', 'r') as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        return jsonify({"error": "Data file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/cases')
def get_cases():
    try:
        with open('data/lassa_fever_cases.geojson', 'r') as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        return jsonify({"error": "Cases file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/upload-dataset', methods=['POST', 'OPTIONS'])
def upload_dataset():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    return handle_upload(request)

@api.route('/fcm-token', methods=['POST'])
def get_fcm_token():
    global token_cache
    
    # Check if we have a valid cached token
    if (token_cache['token'] and token_cache['expiry'] and 
        datetime.now() < token_cache['expiry'] - timedelta(minutes=5)):
        return jsonify({
            'accessToken': token_cache['token'],
            'expiry': token_cache['expiry'].isoformat()
        })
    
    try:
        # Load service account credentials
        credentials = service_account.Credentials.from_service_account_file(
            'service-account.json',
            scopes=['https://www.googleapis.com/auth/firebase.messaging']
        )
        
        # Refresh the credentials to get a new token
        credentials.refresh(Request())
        
        # Cache the new token
        token_cache['token'] = credentials.token
        token_cache['expiry'] = credentials.expiry
        
        return jsonify({
            'accessToken': credentials.token,
            'expiry': credentials.expiry.isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500