from flask import Blueprint, request, jsonify
from .models import User
from . import db, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
import re # For basic email validation

# Create a Blueprint
auth_bp = Blueprint('auth', __name__)

# Basic email regex (for simple validation)
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # --- Basic Input Validation ---
    if not username or not email or not password:
        return jsonify({"error": "Missing username, email, or password"}), 400

    if len(password) < 8:
         return jsonify({"error": "Password must be at least 8 characters long"}), 400

    if not re.match(EMAIL_REGEX, email):
         return jsonify({"error": "Invalid email format"}), 400

    # --- Check for existing user ---
    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 409 # 409 Conflict

    # --- Create new user ---
    try:
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": f"User '{username}' registered successfully!"}), 201 # 201 Created
    except Exception as e:
        db.session.rollback() # Rollback in case of error
        print(f"Error during registration: {e}") # Log the error
        return jsonify({"error": "An internal error occurred during registration."}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        # Identity can be user.id, user.email, or any unique identifier
        access_token = create_access_token(identity="hello", expires_delta=False) # No expiration for simplicity
        return jsonify(access_token=access_token), 200
    else:
        # Use a generic message to avoid revealing which field was wrong
        return jsonify({"error": "Invalid email or password"}), 401 # 401 Unauthorized

@auth_bp.route('/verify', methods=['GET'])
@jwt_required() # Protect this route with JWT
def verify_token():

        return jsonify({"user":"siawab"}), 200
    