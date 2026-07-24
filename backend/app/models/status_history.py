from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.item import Status

if TYPE_CHECKING:  # import only for type hints, avoids a circular import at runtime
    from app.models.item import Item


class StatusHistory(Base):
    __tablename__ = "status_history"

    id: Mapped[int] = mapped_column(primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))  # FK -> items.id
    status: Mapped[Status] = mapped_column()  # the status being transitioned into
    changed_at: Mapped[datetime] = mapped_column(server_default=func.now())  # set by SQLite on insert

    item: Mapped["Item"] = relationship(back_populates="status_history")  # lets you do history.item
