from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from .config import app_config # Import the loaded config object

# Initialize extensions (without app context initially)
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    """Application Factory Function"""
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    app.config.from_object(app_config) # Load configuration from config object

    # Initialize extensions with the app context
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import models here after db is initialized to avoid circular imports
    # and ensure models are known to Flask-Migrate
    from . import models

    # Import and register Blueprints or routes here
    from .routes import auth_bp # Import the blueprint
    app.register_blueprint(auth_bp, url_prefix='/auth') # Register with a prefix

    # A simple default route (optional)
    @app.route('/')
    def index():
        return "Welcome to the Voting App Backend!"

    return app