from pydantic import BaseModel


class ReserveRequest(BaseModel):
    train_id: int
    seat: str
