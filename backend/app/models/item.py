import enum
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import JSON, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:  # import only for type hints, avoids a circular import at runtime
    from app.models.category import Category
    from app.models.status_history import StatusHistory


class Status(str, enum.Enum):  # str mixin so values serialize as plain strings (e.g. in JSON)
    not_listed = "not listed"
    listed = "listed"
    sold = "sold"


class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))  # FK -> categories.id
    status: Mapped[Status] = mapped_column(default=Status.not_listed)  # stored as constrained VARCHAR
    attributes: Mapped[dict] = mapped_column(JSON, default=dict)  # category-specific fields blob
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())  # set by SQLite on insert

    category: Mapped["Category"] = relationship(back_populates="items")  # lets you do item.category
    status_history: Mapped[list["StatusHistory"]] = relationship(back_populates="item")  # all transitions
