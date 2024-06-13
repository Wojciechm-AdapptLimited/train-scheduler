from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import cassandra
from datetime import datetime
import traceback
import asyncio
import random

from domain import DummyData
from domain.Post import ReserveRequest


app = FastAPI()

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


class Context:
    def __enter__(self):
        #self.cluster = Cluster(['12'])
        #self.session = self.cluster.connect()
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        #self.cluster.shutdown()
        pass


@app.get("/")
async def root():
    return {"Hello": "World"}


@app.get("/tickets")
async def get_trains():
    try:
        return DummyData.tickets
    except Exception:
        print(traceback.format_exc())
        raise HTTPException(500, "Internal Server Error")


@app.get("/ticket/{ticket_id}")
async def get_ticket(ticket_id):
    try:
        return DummyData.tickets[int(ticket_id)]
    except Exception:
        print(traceback.format_exc())
        raise HTTPException(500, "Internal Server Error")


@app.get("/seats/{ticket_id}")
async def get_seats(ticket_id:str):
    try:
        return DummyData.tickets[int(ticket_id)]["seats"]
    except Exception:
        print(traceback.format_exc())
        raise HTTPException(500, "Internal Server Error")


@app.get("/passengers/{ticket_id}")
async def get_passengers(ticket_id: str):
    try:
        return DummyData.tickets[int(ticket_id)]["passengers"]
    except Exception:
        print(traceback.format_exc())
        raise HTTPException(500, "Internal Server Error")

@app.post("/login")
async def login(data):
    try:
        return data
    except Exception:
        print(traceback.format_exc())
        raise HTTPException(500, "Internal Server Error")


@app.post("/reserve")
async def reserve(data: ReserveRequest):
    try:
        DummyData.tickets[int(data.train_id)]["seats"].remove(data.seat)
        DummyData.tickets[int(data.train_id)]["passengers"].append({"name":data.user_id,"seat":data.seat})
        return data
    except Exception:
        print(traceback.format_exc())
        raise HTTPException(500, "Internal Server Error")