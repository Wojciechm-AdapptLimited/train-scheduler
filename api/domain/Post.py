from pydantic import BaseModel


class ReserveRequest(BaseModel):
    user_id: str
    train_id: str
    seat: str
