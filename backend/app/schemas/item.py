from typing import Any

from pydantic import BaseModel, ConfigDict, model_validator

from app.models.item import Status


class BaseballCardAttributes(BaseModel):
    player: str
    year: int
    grade: float


class ShirtAttributes(BaseModel):
    size: str
    brand: str


# category name -> the attribute schema that validates its `attributes` blob
CATEGORY_ATTRIBUTE_SCHEMAS: dict[str, type[BaseModel]] = {
    "baseball card": BaseballCardAttributes,
    "shirt": ShirtAttributes,
}


class ItemCreate(BaseModel):
    category: str  # category *name*, e.g. "baseball card" — not the DB id
    attributes: dict[str, Any]

    @model_validator(mode="after")
    def validate_attributes(self) -> "ItemCreate":
        schema_cls = CATEGORY_ATTRIBUTE_SCHEMAS.get(self.category)
        if schema_cls is None:
            raise ValueError(f"Unknown category: {self.category!r}")
        validated = schema_cls(**self.attributes)  # raises if attributes don't match category
        self.attributes = validated.model_dump()
        return self


class ItemRead(BaseModel):
    id: int
    category_id: int
    status: Status
    attributes: dict[str, Any]
    model_config = ConfigDict(from_attributes=True)  # allows building from a SQLAlchemy object


class ItemStatusUpdate(BaseModel):
    status: Status
