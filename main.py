from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.data_routes import data_bp
from routes.training_routes import training_bp
from routes.file_routes import file_bp

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
app.register_blueprint(data_bp, url_prefix='/api')
app.register_blueprint(training_bp, url_prefix='/api')
app.register_blueprint(file_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)