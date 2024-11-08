from flask import Blueprint, jsonify
from sqlalchemy import text
from models.database import get_db
from models.models import (
    MastomysLocation,
    LassaFeverCase,
    EnvironmentalData,
    HistoricalWeather
)

data_bp = Blueprint('data', __name__)

@data_bp.route('/rat-locations', methods=['GET'])
def get_rat_locations():
    db = next(get_db())
    try:
        locations = db.query(MastomysLocation).all()
        return jsonify([{
            'id': loc.id,
            'latitude': db.scalar(text('ST_Y(ST_AsText(geom))')),
            'longitude': db.scalar(text('ST_X(ST_AsText(geom))')),
            'population_size': loc.population_size,
            'habitat_type': loc.habitat_type,
            'observation_date': loc.observation_date.isoformat() if loc.observation_date else None
        } for loc in locations])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@data_bp.route('/cases', methods=['GET'])
def get_lassa_cases():
    db = next(get_db())
    try:
        cases = db.query(LassaFeverCase).all()
        return jsonify([{
            'id': case.id,
            'latitude': db.scalar(text('ST_Y(ST_AsText(geom))')),
            'longitude': db.scalar(text('ST_X(ST_AsText(geom))')),
            'severity': case.severity,
            'report_date': case.report_date.isoformat() if case.report_date else None
        } for case in cases])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@data_bp.route('/weather_data', methods=['GET'])
def get_weather_data():
    db = next(get_db())
    try:
        weather_data = db.query(EnvironmentalData).all()
        return jsonify([{
            'id': data.id,
            'latitude': db.scalar(text('ST_Y(ST_AsText(geom))')),
            'longitude': db.scalar(text('ST_X(ST_AsText(geom))')),
            'temperature': data.temperature,
            'humidity': data.humidity,
            'precipitation': data.precipitation,
            'observation_date': data.observation_date.isoformat() if data.observation_date else None
        } for data in weather_data])
    except Exception as e:
        return jsonify({'error': str(e)}), 500