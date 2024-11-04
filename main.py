from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import blueprints
from routes.rat_locations_controller import rat_locations_bp
from routes.cases_controller import cases_bp
from routes.environmental_controller import environmental_bp
from routes.upload_handler_controller import upload_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load configurations
app.config['SECRET_KEY'] = os.getenv('VITE_FLASK_SECRET_KEY', 'default_secret_key')

if not app.config['SECRET_KEY'] or app.config['SECRET_KEY'] == 'default_secret_key':
    print("Warning: 'VITE_FLASK_SECRET_KEY' not found or using a default value.")

# Register routes
app.register_blueprint(rat_locations_bp, url_prefix='/api/rat-locations')
app.register_blueprint(cases_bp, url_prefix='/api/cases')
app.register_blueprint(environmental_bp, url_prefix='/api/environment')
app.register_blueprint(upload_bp, url_prefix='/api/uploads')

@app.route('/test')
def test():
    return "Flask and CORS are working!"

@app.route('/')
def home():
    return "Welcome to the Mastomys Natalensis Tracker API!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 3000)), debug=True)