from flask import Flask
from flask_cors import CORS
from src.config.settings import FLASK_CONFIG, CORS_CONFIG
from src.routes.api import api

app = Flask(__name__)
CORS(app, resources={"/*": CORS_CONFIG})

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(
        host=FLASK_CONFIG['HOST'],
        port=FLASK_CONFIG['PORT'],
        debug=FLASK_CONFIG['DEBUG']
    )