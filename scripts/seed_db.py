from datetime import datetime
from cassandra.cluster import Cluster
from cassandra.cqlengine import connection
from cassandra.cqlengine.management import sync_table
from api.domain import Train, Seat, Passenger, Ticket, TrainLocation

host = "127.0.0.1"

print("Connecting to cluster...")
cluster = Cluster([(host,port) for port in range(9042,9044+1)])
session = cluster.connect()
session.default_timeout = 60
print("Creating keyspace ttms if not exists")
session.execute("""
    CREATE KEYSPACE IF NOT EXISTS ttms
    WITH REPLICATION = {'class':'SimpleStrategy','replication_factor':'2'}
""")
session.set_keyspace("ttms")
connection.set_session(session)
# connection.setup(
#     hosts=[host],
#     default_keyspace="ttms",
#     consistency=connection.ConsistencyLevel.QUORUM,
# )

print("Creating tables...")
sync_table(Train)
sync_table(Seat)
sync_table(Passenger)
sync_table(Ticket)
sync_table(TrainLocation)

print("Inserting data into tables...")
stations = ["Poznan", "Krakow"]

print("Creating trains...")
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

print("Creating seats...")
for i in range(1, 11):
    for j in range(1, 6):
        for k in range(1, 61):
            Seat.create(train=i, seat=f"{j}-{k}", occupied=False)

print("Creating passengers...")
Passenger.create(login="c1")
Passenger.create(login="c2")
