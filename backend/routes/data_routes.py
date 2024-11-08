from flask import Blueprint, jsonify
from models.database import get_db
from sqlalchemy import text
from geoalchemy2.shape import to_shape
import json

data_bp = Blueprint('data', __name__)

@data_bp.route('/rat-locations', methods=['GET', 'OPTIONS'])
def get_rat_locations():
    """Get rat locations from database"""
    db = next(get_db())
    try:
        query = """
            SELECT json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(
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
                )
            )
            FROM mastomys_locations;
        """
        result = db.execute(text(query)).scalar()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@data_bp.route('/cases', methods=['GET', 'OPTIONS'])
def get_cases():
    """Get Lassa fever cases from database"""
    db = next(get_db())
    try:
        query = """
            SELECT json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(
                    json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(geom)::json,
                        'properties', json_build_object(
                            'id', id,
                            'report_date', report_date,
                            'severity', severity,
                            'patient_age', patient_age,
                            'patient_gender', patient_gender,
                            'outcome', outcome,
                            'hospitalization_required', hospitalization_required
                        )
                    )
                )
            )
            FROM lassa_fever_cases;
        """
        result = db.execute(text(query)).scalar()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()