from flask import Blueprint, jsonify

cases_bp = Blueprint('cases', __name__)

@cases_bp.route('/cases', methods=['GET'])
def get_cases():
    # Return mock data for now
    mock_cases = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [3.3792, 6.5244]  # Lagos coordinates
                },
                "properties": {
                    "id": 1,
                    "severity": "high",
                    "date": "2024-03-15"
                }
            }
        ]
    }
    return jsonify(mock_cases)