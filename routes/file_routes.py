from flask import Blueprint, jsonify, request
from utils.file_handling import handle_file_upload, stream_file
import os

file_bp = Blueprint('file', __name__)

@file_bp.route('/files/csvPaths/historicalCases', methods=['GET', 'OPTIONS'])
def get_historical_cases():
    file_path = os.getenv('VITE_HISTORICAL_CASES_CSV_PATH')
    return stream_file(file_path)

@file_bp.route('/files/geojsonPaths/mnData', methods=['GET', 'OPTIONS'])
def get_mn_data():
    file_path = os.getenv('VITE_MN_GEOJSON_PATH')
    return stream_file(file_path)

@file_bp.route('/upload-dataset', methods=['POST', 'OPTIONS'])
def upload_dataset():
    return handle_file_upload(request)