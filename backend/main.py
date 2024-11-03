from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.data_routes import data_bp
from routes.training_routes import training_bp
from routes.file_routes import file_bp
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
        "supports_credentials": True
    }
})

# Register blueprints
app.register_blueprint(data_bp, url_prefix='/api')
app.register_blueprint(training_bp, url_prefix='/api')
app.register_blueprint(file_bp, url_prefix='/api')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)