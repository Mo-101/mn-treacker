from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.weather_controller import weather_bp
from routes.cases_controller import cases_bp
from routes.rat_locations_controller import rat_locations_bp
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(weather_bp, url_prefix='/api')
app.register_blueprint(cases_bp, url_prefix='/api')
app.register_blueprint(rat_locations_bp, url_prefix='/api')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)