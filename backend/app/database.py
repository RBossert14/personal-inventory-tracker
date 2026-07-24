from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# File created on first Base.metadata.create_all(), relative to the app's working directory
SQLALCHEMY_DATABASE_URL = "sqlite:///./inventory.db"

# check_same_thread=False: SQLite blocks cross-thread use by default, which breaks under FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Factory for per-request sessions (not a session itself) — call SessionLocal() to get one
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Every model inherits from this; registers the model with SQLAlchemy's table metadata
class Base(DeclarativeBase):
    pass
