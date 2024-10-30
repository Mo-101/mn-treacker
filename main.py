from flask import Flask, jsonify, send_from_directory, request, Response
from flask_cors import CORS
import os
import json
import requests
from dotenv import load_dotenv
import threading
import time
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Global variables
training_progress = 0
is_training = False
model = None
performance_metrics = {}
connection_status = {}

def validate_data_file(file_path, expected_format):
    """Validate data file exists and has correct format"""
    if not os.path.exists(file_path):
        return False, "File not found"
    
    try:
        if expected_format == 'geojson':
            with open(file_path, 'r') as f:
                data = json.load(f)
                if not all(key in data for key in ['type', 'features']):
                    return False, "Invalid GeoJSON format"
        elif expected_format == 'csv':
            pd.read_csv(file_path)
        return True, None
    except Exception as e:
        return False, str(e)

def acknowledge_connection(client_id, success=True, reason=None):
    """Handle connection acknowledgment"""
    if success:
        connection_status[client_id] = {'status': 'connected', 'timestamp': time.time()}
        return jsonify({'type': 'ack', 'client_id': client_id}), 200
    else:
        connection_status[client_id] = {'status': 'failed', 'reason': reason, 'timestamp': time.time()}
        return jsonify({'type': 'nack', 'client_id': client_id, 'reason': reason}), 400

@app.route('/api/connect', methods=['POST'])
def handle_connection():
    """Handle new connection requests with acknowledgment"""
    client_id = request.json.get('client_id')
    if not client_id:
        return acknowledge_connection(None, False, 'Missing client_id')
    
    try:
        return acknowledge_connection(client_id)
    except Exception as e:
        return acknowledge_connection(client_id, False, str(e))

def stream_file(file_path, chunk_size=1024):
    """Stream large files with proper error handling"""
    def generate():
        try:
            with open(file_path, 'rb') as f:
                while True:
                    data = f.read(chunk_size)
                    if not data:
                        break
                    yield data
        except Exception as e:
            yield json.dumps({'error': str(e)}).encode()
    
    return Response(generate(), content_type='application/json')

def train_model():
    global training_progress, is_training, model, performance_metrics
    is_training = True
    training_progress = 0

    try:
        # Validate data file
        data_file = 'data/mastomys_natalensis_data.csv'
        is_valid, error_msg = validate_data_file(data_file, 'csv')
        if not is_valid:
            raise ValueError(f"Invalid training data: {error_msg}")

        # Load and process data
        data = pd.read_csv(data_file)
        X = data.drop('presence', axis=1)
        y = data['presence']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        for i in range(1, 101):
            training_progress = i
            time.sleep(0.5)
            if i == 50:
                model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        performance_metrics = {
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision': float(precision_score(y_test, y_pred)),
            'recall': float(recall_score(y_test, y_pred)),
            'f1': float(f1_score(y_test, y_pred))
        }
        
        is_training = False
        return True
    except Exception as e:
        is_training = False
        print(f"Training error: {str(e)}")
        return False

@app.route('/api/rat-locations')
def get_rat_locations():
    """Get rat locations with validation"""
    file_path = os.path.join('data', 'mastomys_natalensis_locations.geojson')
    is_valid, error_msg = validate_data_file(file_path, 'geojson')
    
    if not is_valid:
        return jsonify({"error": error_msg}), 404
    
    return stream_file(file_path)

@app.route('/api/cases')
def get_cases():
    """Get Lassa fever cases with validation"""
    file_path = os.path.join('data', 'lassa_fever_cases.geojson')
    is_valid, error_msg = validate_data_file(file_path, 'geojson')
    
    if not is_valid:
        return jsonify({"error": error_msg}), 404
    
    return stream_file(file_path)

@app.route('/api/training-progress', methods=['GET'])
def get_training_progress():
    """Get current training progress"""
    return jsonify({
        "progress": training_progress,
        "is_training": is_training,
        "metrics": performance_metrics
    }), 200

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    """Get available datasets with validation"""
    datasets = []
    for filename in ['mastomys_natalensis_locations.geojson', 'lassa_fever_cases.geojson', 
                    'environmental_factors.csv', 'historical_weather_data.csv']:
        file_path = os.path.join('data', filename)
        is_valid, _ = validate_data_file(file_path, 'geojson' if filename.endswith('.geojson') else 'csv')
        datasets.append({
            "name": filename.replace('_', ' ').replace('.', ' - ').title(),
            "file": filename,
            "status": "available" if is_valid else "missing"
        })
    return jsonify(datasets), 200

@app.route('/api/upload-dataset', methods=['POST'])
def upload_dataset():
    """Handle dataset upload with validation"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        try:
            filename = file.filename
            file_path = os.path.join('data', filename)
            file.save(file_path)
            
            # Validate uploaded file
            is_valid, error_msg = validate_data_file(
                file_path, 
                'geojson' if filename.endswith('.geojson') else 'csv'
            )
            
            if not is_valid:
                os.remove(file_path)  # Remove invalid file
                return jsonify({"error": f"Invalid file: {error_msg}"}), 400
                
            return jsonify({"message": f"File {filename} uploaded and validated successfully"}), 200
        except Exception as e:
            return jsonify({"error": f"Upload failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)