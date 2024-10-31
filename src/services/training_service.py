import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Global variables for training state
training_progress = 0
is_training = False
model = None
performance_metrics = {}

def train_model():
    global training_progress, is_training, model, performance_metrics
    is_training = True
    training_progress = 0

    try:
        data_file = 'data/mastomys_natalensis_data.csv'
        is_valid, error_msg = validate_data_file(data_file, 'csv')
        if not is_valid:
            raise ValueError(f"Invalid training data: {error_msg}")

        data = pd.read_csv(data_file)
        X = data.drop('presence', axis=1)
        y = data['presence']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        model.fit(X_train, y_train)
        training_progress = 100
        
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

def get_training_status():
    """Get current training progress"""
    return {
        "progress": training_progress,
        "is_training": is_training,
        "metrics": performance_metrics
    }