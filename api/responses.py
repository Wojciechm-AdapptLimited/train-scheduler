# type: ignore

from datetime import datetime

from pydantic import BaseModel

from api.domain import Seat, Train, Ticket


class TrainResponse(BaseModel):
    id: int
    from_station: str
    to_station: str
    departure: datetime
    arrival: datetime

    @classmethod
    def from_domain(cls, train: Train) -> "TrainResponse":
        return cls(
            id=train.id,
            from_station=train.from_station,
            to_station=train.to_station,
            departure=train.departure,
            arrival=train.arrival,
        )


class SeatResponse(BaseModel):
    seat: str
    occupied: bool


class TrainDetailedResponse(TrainResponse):
    seats: list[SeatResponse]

    @classmethod
    def from_domain(cls, train: Train, seats: list[Seat]) -> "TrainDetailedResponse":
        train_rsp = TrainResponse.from_domain(train)
        return cls(
            **train_rsp.model_dump(),
            seats=[
                SeatResponse(seat=seat.seat, occupied=seat.occupied) for seat in seats
            ]
        )


class TicketResponse(BaseModel):
    id: str
    login: str
    train: int
    seat: str

    @classmethod
    def from_domain(cls, ticket: Ticket) -> "TicketResponse":
        return cls(
            id=str(ticket.id),
            login=ticket.login,
            train=ticket.train,
            seat=ticket.seat,
        )