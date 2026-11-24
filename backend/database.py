from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Database URL: creates a file named "subscriptions.db" inside your backend folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./subscriptions.db"

# Create the database engine
# Note: "check_same_thread": False is only needed for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal is the factory that will create new database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class: all our database models (tables) will inherit from this
Base = declarative_base()

# Dependency function: opens a DB session for an API request and closes it when done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()