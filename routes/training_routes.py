from flask import Blueprint, jsonify
from utils.model_training import train_model, get_training_status

training_bp = Blueprint('training', __name__)

@training_bp.route('/training-progress', methods=['GET'])
def get_training_progress():
    """Get current training progress"""
    return jsonify(get_training_status()), 200