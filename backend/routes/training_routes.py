from flask import Blueprint, jsonify
from utils.model_training import train_model, get_training_status

training_bp = Blueprint('training', __name__)

@training_bp.route('/training-progress', methods=['GET'])
def get_training_progress():
    """Get current training progress"""
    status = get_training_status()
    return jsonify({
        "progress": status["progress"],
        "isTraining": status["is_training"],
        "metrics": status["metrics"],
        "activities": ["Initializing model...", "Loading data...", "Training in progress..."],
        "timeLeft": 300,  # Example: 5 minutes remaining
        "elapsedTime": 120,  # Example: 2 minutes elapsed
        "knowledgeLevel": 75  # Example knowledge level
    }), 200