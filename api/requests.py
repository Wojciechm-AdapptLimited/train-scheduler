from pydantic import BaseModel


class ReserveRequest(BaseModel):
    train_id: int
    seat: str


class TrainLocationRequest(BaseModel):
    train_id: int
    x: float
    y: float
