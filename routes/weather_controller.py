from flask import Blueprint, jsonify
from models.database import get_db
from sqlalchemy import text

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather_data', methods=['GET'])
def get_weather_data():
    """Get weather data from database"""
    db = next(get_db())
    try:
        query = """
            SELECT json_build_object(
                'layers', json_agg(
                    json_build_object(
                        'id', id,
                        'name', name,
                        'type', type,
                        'data', data
                    )
                )
            )
            FROM weather_layers;
        """
        result = db.execute(text(query)).scalar()
        return jsonify(result if result else {'layers': []})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()