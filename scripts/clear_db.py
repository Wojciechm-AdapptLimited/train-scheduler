from datetime import datetime
from cassandra.cluster import Cluster
from cassandra.cqlengine import connection
from cassandra.cqlengine.management import sync_table
from api.domain import Train, Seat, Passenger, Ticket

host = "127.0.0.1"

print("Connecting to cluster...")
cluster = Cluster([(host,port) for port in range(9042,9044+1)])
session = cluster.connect()

print("Dropping keyspace ttms")
session.execute("DROP KEYSPACE IF EXISTS ttms")
