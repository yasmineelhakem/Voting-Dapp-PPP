import pytest
from flask import Flask
from app import create_app, db
from app.models import User
from flask_jwt_extended import create_access_token
import os

@pytest.fixture
def client():
    os.environ['FLASK_ENV'] = 'testing'  # Ensure testing config is used
    app = create_app()

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

# Utility to create user in DB
def create_test_user():
    user = User(username="testuser", email="test@example.com", password="password123")
    db.session.add(user)
    db.session.commit()

# --- POST /register ---
@pytest.mark.parametrize("data, expected_status", [
    ({"username": "newuser", "email": "new@example.com", "password": "password123"}, 201),
    (None, 415),
    ({"email": "test@example.com", "password": "password123"}, 400),
    ({"username": "testuser", "email": "invalidemail", "password": "password123"}, 400),
    ({"username": "testuser", "email": "test@example.com", "password": "short"}, 400),
])
def test_register(client, data, expected_status):
    response = client.post('/auth/register', json=data)
    assert response.status_code == expected_status

def test_register_duplicate_user(client):
    # Create user first
    client.post('/auth/register', json={"username": "duplicateuser", "email": "duplicate@example.com", "password": "password123"})
    
    # Attempt to register with same username/email
    response = client.post('/auth/register', json={"username": "duplicateuser", "email": "duplicate@example.com", "password": "password123"})
    assert response.status_code == 409

# --- Simulate DB error ---
def test_register_db_error(client, monkeypatch):
    def mock_commit():
        raise Exception("Mock DB error")

    monkeypatch.setattr(db.session, "commit", mock_commit)

    response = client.post('/auth/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })

    assert response.status_code == 500

# --- POST /login ---
@pytest.mark.parametrize("data, expected_status", [
    ({"email": "test@example.com", "password": "password123"}, 200),
    (None, 415),
    ({"password": "password123"}, 400),
    ({"email": "test@example.com", "password": "wrongpassword"}, 401),
])
def test_login(client, data, expected_status):
    # Setup: Create test user
    with db.session.begin():
        db.session.add(User(username="testuser", email="test@example.com", password="password123"))

    response = client.post('/auth/login', json=data)
    assert response.status_code == expected_status

# --- GET /verify ---
def test_verify_valid_token(client):
    with client.application.app_context():
        access_token = create_access_token(identity="siawab")  # Match identity in route

    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get('/auth/verify', headers=headers)
    assert response.status_code == 200

@pytest.mark.parametrize("token, expected_status", [
    (None, 401),
    ("invalid_token", 422),  # Flask-JWT-Extended returns 422 for malformed tokens
])
def test_verify_invalid_or_missing_token(client, token, expected_status):
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    response = client.get('/auth/verify', headers=headers)
    assert response.status_code == expected_status
