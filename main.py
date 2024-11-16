from flask import Flask, jsonify, send_from_directory, request, Response
from flask_cors import CORS
import os
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

# Function to train the model
def train_model():
    global training_progress, is_training, model, performance_metrics
    is_training = True
    training_progress = 0
    
    # Initialize empty training data
    X = pd.DataFrame()
    y = pd.Series()
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    for i in range(1, 101):
        training_progress = i
        time.sleep(0.5)
        if i == 50:
            if not X_train.empty and not y_train.empty:
                model.fit(X_train, y_train)
    
    performance_metrics = {
        'accuracy': 0,
        'precision': 0,
        'recall': 0,
        'f1': 0
    }
    
    is_training = False

# Serve the main frontend (index.html from public folder)
@app.route('/')
def serve_frontend():
    return send_from_directory('public', 'index.html')

# Serve static files like JS, CSS from public folder
@app.route('/public/<path:filename>')
def serve_static(filename):
    return send_from_directory('public', filename)

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