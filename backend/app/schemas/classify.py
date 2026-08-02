from pydantic import BaseModel


class LabelScore(BaseModel):
    label: str
    score: float


class ClassifyResponse(BaseModel):
    category: list[LabelScore]
    condition: list[LabelScore]
