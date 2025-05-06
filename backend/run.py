from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible on the network if needed
    # Debug mode should be enabled via FLASK_ENV=development, not here directly in production
    host = os.getenv('FLASK_RUN_HOST', '127.0.0.1')
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    app.run(host=host, port=port)