from flask import Blueprint, jsonify

rat_locations_bp = Blueprint('rat_locations', __name__)

@rat_locations_bp.route('/rat-locations', methods=['GET'])
def get_rat_locations():
    # Return mock data for now
    mock_locations = {
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
                    "count": 5,
                    "date": "2024-03-15"
                }
            }
        ]
    }
    return jsonify(mock_locations)