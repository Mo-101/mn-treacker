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

# Global variables to store training progress and model
training_progress = 0
is_training = False
model = None
performance_metrics = {}

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

# Fetch OpenWeather data for specific layers
def get_openweather_data(lat, lon, layer='weather'):
    api_key = os.getenv('OPENWEATHER_API_KEY')
    if not api_key:
        return {"error": "OpenWeather API key is missing"}
    
    openweather_url = f"http://api.openweathermap.org/data/2.5/{layer}?lat={lat}&lon={lon}&appid={api_key}"
    response = requests.get(openweather_url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Failed to fetch {layer} data from OpenWeather"}

# Serve the main frontend (index.html from public folder)
@app.route('/')
def serve_frontend():
    return send_from_directory('public', 'index.html')

# Serve static files like JS, CSS from public folder
@app.route('/public/<path:filename>')
def serve_static(filename):
    return send_from_directory('public', filename)

# API route to return OpenWeather data
@app.route('/api/openweather', methods=['GET'])
def openweather_data():
    layer = request.args.get('layer', 'weather')
    lat = request.args.get('lat', default=9.0820, type=float)
    lon = request.args.get('lon', default=8.6753, type=float)
    weather_data = get_openweather_data(lat, lon, layer)
    return jsonify(weather_data)

# API route to stream rodent locations
@app.route('/api/rat-locations')
def get_rat_locations():
    file_path = os.path.join('data', 'mastomys_natalensis_locations.geojson')
    if os.path.exists(file_path):
        return stream_file(file_path)
    else:
        return jsonify({"error": "Mastomys natalensis locations data file not found"}), 404

# API route to stream Lassa Fever cases
@app.route('/api/cases')
def get_cases():
    file_path = os.path.join('data', 'lassa_fever_cases.geojson')
    if os.path.exists(file_path):
        return stream_file(file_path)
    else:
        return jsonify({"error": "Lassa Fever cases data file not found"}), 404

# API endpoint to initiate the training process
@app.route('/api/start-training', methods=['POST'])
def start_training():
    global is_training
    if is_training:
        return jsonify({"error": "Training is already in progress"}), 409
    threading.Thread(target=train_model).start()
    return jsonify({"message": "Training started"}), 200

# API endpoint to get the current training progress
@app.route('/api/training-progress', methods=['GET'])
def get_training_progress():
    global performance_metrics
    return jsonify({
        "progress": training_progress,
        "is_training": is_training,
        "metrics": performance_metrics
    }), 200

# New API endpoint to get available datasets
@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    datasets = [
        {"name": "Mastomys natalensis locations", "file": "mastomys_natalensis_locations.geojson"},
        {"name": "Lassa Fever cases", "file": "lassa_fever_cases.geojson"},
        {"name": "Environmental factors", "file": "environmental_factors.csv"},
        {"name": "Historical weather data", "file": "historical_weather_data.csv"}
    ]
    return jsonify(datasets), 200

# New API endpoint to upload a dataset
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