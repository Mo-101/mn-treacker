from flask import Blueprint, jsonify, request, Response
from ..utils.validators import validate_data_file, acknowledge_connection
from ..services.data_service import stream_file, handle_upload
from ..services.training_service import train_model, get_training_status

api = Blueprint('api', __name__)

@api.route('/connect', methods=['POST', 'OPTIONS'])
def handle_connection():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    client_id = request.json.get('client_id')
    if not client_id:
        return jsonify(acknowledge_connection(None, False, 'Missing client_id')), 400
    
    try:
        return jsonify(acknowledge_connection(client_id)), 200
    except Exception as e:
        return jsonify(acknowledge_connection(client_id, False, str(e))), 500

@api.route('/rat-locations')
def get_rat_locations():
    file_path = os.path.join('data', 'mastomys_natalensis_locations.geojson')
    is_valid, error_msg = validate_data_file(file_path, 'geojson')
    
    if not is_valid:
        return jsonify({"error": error_msg}), 404
    
    return stream_file(file_path)

@api.route('/cases')
def get_cases():
    file_path = os.path.join('data', 'lassa_fever_cases.geojson')
    is_valid, error_msg = validate_data_file(file_path, 'geojson')
    
    if not is_valid:
        return jsonify({"error": error_msg}), 404
    
    return stream_file(file_path)

@api.route('/training-progress', methods=['GET'])
def get_training_progress():
    return jsonify(get_training_status()), 200

@api.route('/upload-dataset', methods=['POST', 'OPTIONS'])
def upload_dataset():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    return handle_upload(request)