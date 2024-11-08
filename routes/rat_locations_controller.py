from flask import Blueprint, jsonify
from models.database import get_db
from sqlalchemy import text

rat_locations_bp = Blueprint('rat_locations', __name__)

@rat_locations_bp.route('/rat-locations', methods=['GET'])
def get_rat_locations():
    """Get rat locations from database"""
    db = next(get_db())
    try:
        query = """
            SELECT json_build_object(
                'type', 'FeatureCollection',
                'features', COALESCE(json_agg(
                    json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(geom)::json,
                        'properties', json_build_object(
                            'id', id,
                            'observation_date', observation_date,
                            'population_size', population_size,
                            'habitat_type', habitat_type,
                            'vegetation_density', vegetation_density,
                            'elevation', elevation,
                            'temperature', temperature,
                            'humidity', humidity
                        )
                    )
                ), '[]'::json)
            )
            FROM mastomys_locations;
        """
        result = db.execute(text(query)).scalar()
        return jsonify(result if result else {'type': 'FeatureCollection', 'features': []})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()