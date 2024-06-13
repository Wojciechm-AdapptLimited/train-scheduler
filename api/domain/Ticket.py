from dataclasses import dataclass


@dataclass
class Ticket:
    id: int
    user: str
    schedule: int
    seat: int
    reduced: bool = False
