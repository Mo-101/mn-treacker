import os
import json
import pandas as pd

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
        return {'status': 'connected', 'timestamp': time.time()}
    else:
        return {'status': 'failed', 'reason': reason, 'timestamp': time.time()}