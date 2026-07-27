from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):  # input shape; same as base for now
    pass


class CategoryRead(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)  # allows building from a SQLAlchemy object
