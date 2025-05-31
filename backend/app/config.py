import os
from dotenv import load_dotenv

# Load environment variables from .env file
#basedir = os.path.abspath(os.path.dirname(__file__))
#dotenv_path = os.path.join(basedir, '..', '.env')
#if os.path.exists(dotenv_path):
#    load_dotenv(dotenv_path)
#else:
#    print("Warning: .env file not found.")


class Config:
    """Base configuration."""
    def __init__(self):
        self.DEBUG = False
        self.TESTING = False
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"  # Default for non-production
        self.JWT_SECRET_KEY = 'default-jwt-secret-key'  # Default fallback


class DevelopmentConfig(Config):
    """Development configuration."""
    def __init__(self):
        super().__init__()
        self.DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""
    def __init__(self):
        super().__init__()
        self.SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
        if not self.SQLALCHEMY_DATABASE_URI:
            raise ValueError("No DATABASE_URL set for Flask application")

        self.JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
        if not self.JWT_SECRET_KEY:
            raise ValueError("No JWT_SECRET_KEY set for Flask application")

        self.DEBUG = False


class TestingConfig(Config):
    """Testing configuration."""
    def __init__(self):
        super().__init__()
        self.DEBUG = True
        self.WTF_CSRF_ENABLED = False


# Select the configuration based on an environment variable
config_by_name = dict(
    development=DevelopmentConfig,
    production=ProductionConfig,
    testing=TestingConfig,
    default=TestingConfig,
)

def get_config():
    env = os.getenv('FLASK_ENV', 'testing')
    print(f"Using configuration: {env}")
    config_class = config_by_name.get(env)
    return config_class()  # Return an instance

# Load the appropriate config instance
app_config = get_config()
