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
    
    # Validate connection parameters
    try:
        # Add any specific connection validation here
        return acknowledge_connection(client_id)
    except Exception as e:
        return acknowledge_connection(client_id, False, str(e))

# Helper function to stream large files
def stream_file(file_path, chunk_size=1024):
    def generate():
        with open(file_path, 'rb') as f:
            while True:
                data = f.read(chunk_size)
                if not data:
                    break
                yield data
    return Response(generate(), content_type='application/json')

# Function to train the model
def train_model():
    global training_progress, is_training, model, performance_metrics
    is_training = True
    training_progress = 0

    try:
        # Load the dataset
        data = pd.read_csv('data/mastomys_natalensis_data.csv')
        
        # Prepare features and target
        X = data.drop('presence', axis=1)
        y = data['presence']
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train the model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        for i in range(1, 101):  # Simulate training from 0% to 100%
            training_progress = i
            time.sleep(0.5)  # Simulate training delay
            if i == 50:  # At 50%, fit the model
                model.fit(X_train, y_train)
        
        # Evaluate the model
        y_pred = model.predict(X_test)
        performance_metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred)
        }
        
        is_training = False
        return True
    except Exception as e:
        is_training = False
        print(f"Training error: {str(e)}")
        return False

# ... keep existing code (API routes for serving frontend, OpenWeather data, rat locations, and Lassa Fever cases)

@app.route('/api/training-progress', methods=['GET'])
def get_training_progress():
    global performance_metrics
    return jsonify({
        "progress": training_progress,
        "is_training": is_training,
        "metrics": performance_metrics
    }), 200

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    datasets = [
        {"name": "Mastomys natalensis locations", "file": "mastomys_natalensis_locations.geojson"},
        {"name": "Lassa Fever cases", "file": "lassa_fever_cases.geojson"},
        {"name": "Environmental factors", "file": "environmental_factors.csv"},
        {"name": "Historical weather data", "file": "historical_weather_data.csv"}
    ]
    return jsonify(datasets), 200

@app.route('/api/upload-dataset', methods=['POST'])
def upload_dataset():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = file.filename
        file.save(os.path.join('data', filename))
        return jsonify({"message": f"File {filename} uploaded successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)