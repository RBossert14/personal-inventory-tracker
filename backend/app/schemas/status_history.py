from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.item import Status


class StatusHistoryRead(BaseModel):
    id: int
    item_id: int
    status: Status
    changed_at: datetime
    model_config = ConfigDict(from_attributes=True)  # allows building from a SQLAlchemy object
