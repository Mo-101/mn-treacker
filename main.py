from flask import Flask, jsonify, send_from_directory, request, Response
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# API route to return OpenWeather data
@app.route('/api/openweather', methods=['GET'])
def openweather_data():
    layer = request.args.get('layer', 'weather')
    lat = request.args.get('lat', default=9.0820, type=float)
    lon = request.args.get('lon', default=8.6753, type=float)
    
    api_key = os.getenv('OPENWEATHER_API_KEY')
    if not api_key:
        return jsonify({"error": "OpenWeather API key is missing"}), 500
        
    openweather_url = f"http://api.openweathermap.org/data/2.5/{layer}?lat={lat}&lon={lon}&appid={api_key}"
    response = requests.get(openweather_url)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": f"Failed to fetch {layer} data from OpenWeather"}), response.status_code

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)