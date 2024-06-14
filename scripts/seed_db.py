from datetime import datetime
from cassandra.cqlengine import connection
from cassandra.cqlengine.management import sync_table
from api.domain import Train, Seat, Passenger, Ticket

connection.setup(
    hosts=["127.0.0.1"],
    default_keyspace="ttms",
    consistency=connection.ConsistencyLevel.QUORUM,
)

sync_table(Train)
sync_table(Seat)
sync_table(Passenger)
sync_table(Ticket)

stations = ["Poznan", "Krakow"]

for i in range(1, 11):
    departure = datetime(2024, 1, i % 5 + 1, i % 3 + 4, 0, 0)
    arrival = datetime(2024, 1, i % 5 + 1, i % 3 + 10, 0, 0)
    from_station = stations[i % 2]
    to_station = stations[(i + 1) % 2]
    Train.create(
        id=i,
        departure=departure,
        arrival=arrival,
        from_station=from_station,
        to_station=to_station,
    )


for i in range(1, 11):
    for j in range(1, 6):
        for k in range(1, 61):
            Seat.create(train=i, seat=f"{j}-{k}", occupied=False)


Passenger.create(login="c1")
Passenger.create(login="c2")
