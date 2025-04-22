from . import db, bcrypt # Use relative import from __init__.py

class User(db.Model):
    """User model for storing user details."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False) # Store hash, not password
    # Add other fields like registration_date, roles, etc. if needed
    # registered_on = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password) # Hash password on initialization

    def set_password(self, password):
        """Hashes the password and stores it."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Checks if the provided password matches the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'