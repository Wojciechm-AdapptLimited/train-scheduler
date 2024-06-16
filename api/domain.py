from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model


class Train(Model):
    id = columns.Integer(primary_key=True)
    departure = columns.DateTime(required=True)
    arrival = columns.DateTime(required=True)
    from_station = columns.Text(required=True)
    to_station = columns.Text(required=True)

class TrainLocation(Model):
    train = columns.Integer(primary_key=True)
    time = columns.DateTime(primary_key=True)
    x = columns.Float(required=True)
    y = columns.Float(required=False)

class Seat(Model):
    train = columns.Integer(primary_key=True)
    seat = columns.Text(primary_key=True)
    occupied = columns.Boolean(default=False)


class Passenger(Model):
    login = columns.Text(primary_key=True)


class Ticket(Model):
    login = columns.Text(primary_key=True)
    id = columns.TimeUUID(primary_key=True)
    train = columns.Integer(required=True)
    seat = columns.Text(required=True)
