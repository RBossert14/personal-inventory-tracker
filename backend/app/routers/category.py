from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Category
from app.schemas.category import CategoryCreate, CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("", response_model=CategoryRead)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)):
    categories = db.execute(select(Category)).scalars().all()  # SELECT * FROM categories
    return categories


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.get(Category, category_id)  # shortcut for fetching by primary key
    if db_category is None:
        raise HTTPException(status_code=404, detail=f"Category not found: {category_id}")
    return db_category
