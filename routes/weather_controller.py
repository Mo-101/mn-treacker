from flask import Blueprint, jsonify
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

weather_bp = Blueprint('weather', __name__)

OPENWEATHER_API_KEY = os.getenv('VITE_OPENWEATHER_API_KEY')

@weather_bp.route('/weather_data', methods=['GET'])
def get_weather_data():
    """Get weather data from OpenWeather API"""
    try:
        # Return a static configuration for weather layers that matches the frontend expectations
        weather_layers = {
            'layers': [
                {
                    'id': 'temperature',
                    'name': 'Temperature',
                    'type': 'raster',
                    'data': f'https://tile.openweathermap.org/map/temp_new/{{z}}/{{x}}/{{y}}.png?appid={OPENWEATHER_API_KEY}'
                },
                {
                    'id': 'precipitation',
                    'name': 'Precipitation',
                    'type': 'raster',
                    'data': f'https://tile.openweathermap.org/map/precipitation_new/{{z}}/{{x}}/{{y}}.png?appid={OPENWEATHER_API_KEY}'
                },
                {
                    'id': 'wind',
                    'name': 'Wind Speed',
                    'type': 'raster',
                    'data': f'https://tile.openweathermap.org/map/wind_new/{{z}}/{{x}}/{{y}}.png?appid={OPENWEATHER_API_KEY}'
                },
                {
                    'id': 'clouds',
                    'name': 'Cloud Cover',
                    'type': 'raster',
                    'data': f'https://tile.openweathermap.org/map/clouds_new/{{z}}/{{x}}/{{y}}.png?appid={OPENWEATHER_API_KEY}'
                }
            ]
        }
        return jsonify(weather_layers)
    except Exception as e:
        return jsonify({"error": str(e)}), 500