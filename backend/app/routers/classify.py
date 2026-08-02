import io

from fastapi import APIRouter, Depends, File, UploadFile
from PIL import Image
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.ml.classifier import classify
from app.models import Category
from app.schemas.classify import ClassifyResponse

router = APIRouter(prefix="/classify", tags=["classify"])

CONDITION_OPTIONS = ["new", "like new", "good", "fair", "poor"]


@router.post("", response_model=ClassifyResponse)
def classify_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    image = Image.open(io.BytesIO(file.file.read())).convert("RGB")

    category_names = db.execute(select(Category.name)).scalars().all()
    category_scores = classify(image, category_names)
    condition_scores = classify(image, CONDITION_OPTIONS)

    return {"category": category_scores, "condition": condition_scores}
