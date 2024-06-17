from datetime import datetime

from cassandra.cqlengine import connection
from cassandra.cqlengine.query import BatchQuery
from cassandra.util import uuid_from_time
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from api.domain import Passenger, Seat, Ticket, Train, TrainLocation
from api.requests import ReserveRequest, TrainLocationRequest
from api.responses import (
    SeatResponse,
    TicketResponse,
    TrainLocationResponse,
    TrainResponse,
)

app = FastAPI()
auth = OAuth2PasswordBearer(tokenUrl="login")
connection.setup(
    hosts=["127.0.0.1"],
    default_keyspace="ttms",
    consistency=connection.ConsistencyLevel.QUORUM,
)


origins = [
    "http://localhost:5173",  # React app URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return "OK"


@app.post("/login")
async def login(login: OAuth2PasswordRequestForm = Depends()):
    if (
        login.username != "admin"
        or Passenger.objects.filter(login=login.username).count() <= 0
    ):
        Passenger.create(login=login.username)
    return {"access_token": login.username, "token_type": "bearer"}


@app.get("/train")
async def get_trains() -> list[TrainResponse]:
    return [TrainResponse.from_domain(train) for train in Train.objects.all()]


@app.get("/train/{train_id}")
async def get_train(train_id: int) -> TrainResponse:
    try:
        train = Train.objects.filter(id=train_id).get()
    except Train.DoesNotExist:
        raise HTTPException(404, "Train not found")

    return TrainResponse.from_domain(train)


@app.get("/train/{train_id}/seat")
async def get_seats(train_id: int) -> list[SeatResponse]:
    try:
        seats = Seat.objects.filter(train=train_id).all()
    except Seat.DoesNotExist:
        raise HTTPException(404, "Trai  not found")

    return [SeatResponse.from_domain(seat) for seat in seats]


@app.get("/train/{train_id}/location")
async def get_train_location(train_id: int) -> list[TrainLocationResponse]:
    try:
        train_locs = TrainLocation.objects.filter(train=train_id).all()
    except TrainLocation.DoesNotExist:
        raise HTTPException(404, "No train location yet")

    return [TrainLocationResponse.from_domain(train_loc) for train_loc in train_locs]


@app.post("/train/{train_id}/location")
async def post_train_location(
    train_id: int, data: TrainLocationRequest
) -> TrainLocationResponse:
    try:
        Train.objects(id=data.train_id).get()
    except Train.DoesNotExist:
        raise HTTPException(404, "No train found")

    train_loc = TrainLocation.create(
        train=train_id, time=datetime.now(), x=data.x, y=data.y
    )

    return TrainLocationResponse.from_domain(train_loc)


@app.get("/ticket")
async def get_tickets(login: str = Depends(auth)) -> list[TicketResponse]:
    if login == "admin":
        tickets = Ticket.objects.all()
    else:
        tickets = Ticket.objects.filter(login=login).all()
    return [TicketResponse.from_domain(ticket) for ticket in tickets]


@app.post("/ticket")
async def create_ticket(
    data: ReserveRequest, login: str = Depends(auth)
) -> TicketResponse:
    print(data)
    try:
        seat = Seat.objects(train=data.train_id, seat=data.seat).get()
    except Seat.DoesNotExist:
        raise HTTPException(404, "Seat not found")

    if seat.occupied:
        raise HTTPException(400, "Seat already occupied")

    b = BatchQuery()
    seat.batch(b).update(occupied=True)
    ticket = Ticket.batch(b).create(
        login=login,
        id=uuid_from_time(datetime.now()),
        train=data.train_id,
        seat=data.seat,
    )
    b.execute()

    return TicketResponse.from_domain(ticket)


@app.get("/ticket/{ticket_id}")
async def get_ticket(ticket_id: str, login: str = Depends(auth)) -> TicketResponse:
    try:
        return TicketResponse.from_domain(
            Ticket.objects.filter(login=login, id=ticket_id).get()
        )
    except Ticket.DoesNotExist:
        raise HTTPException(404, "Ticket not found")


@app.put("/ticket/{ticket_id}")
async def update_ticket(
    ticket_id: str, data: ReserveRequest, login=Depends(auth)
) -> TicketResponse:
    try:
        ticket = Ticket.objects(login=login, id=ticket_id).get()
    except Ticket.DoesNotExist:
        raise HTTPException(404, "Ticket not found")
    if ticket.train != data.train_id:
        raise HTTPException(400, "Train cannot be changed")

    try:
        seat = Seat.objects(train=data.train_id, seat=data.seat).get()
    except Seat.DoesNotExist:
        raise HTTPException(404, "Seat not found")
    if seat.occupied:
        raise HTTPException(400, "Seat already occupied")

    b = BatchQuery()
    Seat.objects(train=ticket.train, seat=ticket.seat).batch(b).update(occupied=False)
    seat.batch(b).update(occupied=True)
    ticket.batch(b).update(train=data.train_id, seat=data.seat)
    b.execute()

    return TicketResponse.from_domain(ticket)


@app.delete("/ticket/{ticket_id}")
async def delete_ticket(ticket_id: str, login=Depends(auth)):
    try:
        ticket = Ticket.objects.filter(login=login, id=ticket_id).get()
    except Ticket.DoesNotExist:
        raise HTTPException(404, "Ticket not found")

    b = BatchQuery()
    Seat.objects(train=ticket.train, seat=ticket.seat).batch(b).update(occupied=False)
    ticket.batch(b).delete()
    b.execute()

    return ticket_id
