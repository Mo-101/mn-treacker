from flask import Blueprint, jsonify, send_from_directory
from utils.data_validation import validate_data_file
import os

data_bp = Blueprint('data', __name__)

@data_bp.route('/rat-locations', methods=['GET', 'OPTIONS'])
def get_rat_locations():
    """Get rat locations with validation"""
    file_path = os.path.join('data', 'mastomys_natalensis_locations.geojson')
    is_valid, error_msg = validate_data_file(file_path, 'geojson')
    
    if not is_valid:
        return jsonify({"error": error_msg}), 404
    
    return send_from_directory('data', 'mastomys_natalensis_locations.geojson')

@data_bp.route('/cases', methods=['GET', 'OPTIONS'])
def get_cases():
    """Get Lassa fever cases with validation"""
    file_path = os.path.join('data', 'lassa_fever_cases.geojson')
    is_valid, error_msg = validate_data_file(file_path, 'geojson')
    
    if not is_valid:
        return jsonify({"error": error_msg}), 404
    
    return send_from_directory('data', 'lassa_fever_cases.geojson')