training_progress = 0
is_training = False
performance_metrics = {}

def get_training_status():
    """Get current training progress and metrics"""
    return {
        "progress": training_progress,
        "is_training": is_training,
        "metrics": performance_metrics
    }

def train_model():
    """Train the model and update progress"""
    global training_progress, is_training, performance_metrics
    # ... keep existing code (model training implementation)