from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 — registers models before create_all
from app.database import Base, engine
from app.routers import category, item

Base.metadata.create_all(engine)  # dev convenience; a migration tool replaces this later

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # the Vite dev server's origin
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(category.router)
app.include_router(item.router)


@app.get("/health")
def health():
    return {"status": "ok"}
