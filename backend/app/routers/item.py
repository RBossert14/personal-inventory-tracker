import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Category, Item, StatusHistory
from app.schemas.item import ItemCreate, ItemRead, ItemStatusUpdate
from app.schemas.status_history import StatusHistoryRead

router = APIRouter(prefix="/items", tags=["items"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("", response_model=ItemRead)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_category = db.execute(
        select(Category).where(Category.name == item.category)
    ).scalar_one_or_none()
    if db_category is None:
        raise HTTPException(status_code=404, detail=f"Category not found: {item.category!r}")

    db_item = Item(category_id=db_category.id, attributes=item.attributes, condition=item.condition)
    db.add(db_item)
    db.flush()  # assigns db_item.id/status without committing, so StatusHistory can reference them

    db.add(StatusHistory(item_id=db_item.id, status=db_item.status))
    db.commit()
    db.refresh(db_item)
    return db_item


@router.get("", response_model=list[ItemRead])
def list_items(db: Session = Depends(get_db)):
    items = db.execute(select(Item)).scalars().all()  # SELECT * FROM items
    return items


@router.get("/{item_id}", response_model=ItemRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.get(Item, item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail=f"Item not found: {item_id}")
    return db_item


@router.patch("/{item_id}/status", response_model=ItemRead)
def update_item_status(item_id: int, update: ItemStatusUpdate, db: Session = Depends(get_db)):
    db_item = db.get(Item, item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail=f"Item not found: {item_id}")

    db_item.status = update.status
    db.add(StatusHistory(item_id=db_item.id, status=update.status))
    db.commit()
    db.refresh(db_item)
    return db_item


@router.get("/{item_id}/status-history", response_model=list[StatusHistoryRead])
def get_item_status_history(item_id: int, db: Session = Depends(get_db)):
    db_item = db.get(Item, item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail=f"Item not found: {item_id}")

    history = db.execute(
        select(StatusHistory).where(StatusHistory.item_id == item_id)
    ).scalars().all()
    return history


@router.post("/{item_id}/image", response_model=ItemRead)
def upload_item_image(item_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_item = db.get(Item, item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail=f"Item not found: {item_id}")

    extension = Path(file.filename).suffix
    filename = f"{item_id}-{uuid.uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    db_item.image_path = file_path.as_posix()  # forward slashes even on Windows, for use in URLs later
    db.commit()
    db.refresh(db_item)
    return db_item
