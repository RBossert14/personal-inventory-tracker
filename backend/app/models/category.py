from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:  # import only for type hints, avoids a circular import at runtime
    from app.models.item import Item


class Category(Base):
    __tablename__ = "categories"  # actual SQL table name; not inferred from the class name

    id: Mapped[int] = mapped_column(primary_key=True)  # auto-incrementing primary key
    name: Mapped[str] = mapped_column(unique=True, index=True)  # required; DB-enforced uniqueness

    items: Mapped[list["Item"]] = relationship(back_populates="category")  # reverse side of Item.category
