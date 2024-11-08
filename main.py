from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import blueprints
from routes.data_routes import data_bp
from routes.weather_controller import weather_bp
from routes.cases_controller import cases_bp
from routes.rat_locations_controller import rat_locations_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Flask app
app.config['SECRET_KEY'] = os.getenv('VITE_FLASK_SECRET_KEY', 'default_secret_key')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Warn if using default secret key
if not app.config['SECRET_KEY'] or app.config['SECRET_KEY'] == 'default_secret_key':
    print("Warning: 'VITE_FLASK_SECRET_KEY' not found or using a default value.")

# Register routes
app.register_blueprint(data_bp, url_prefix='/api')
app.register_blueprint(weather_bp, url_prefix='/api')
app.register_blueprint(cases_bp, url_prefix='/api')
app.register_blueprint(rat_locations_bp, url_prefix='/api')

@app.route('/')
def home():
    return {"message": "Flask API is running"}

if __name__ == '__main__':
    app.run(debug=True)