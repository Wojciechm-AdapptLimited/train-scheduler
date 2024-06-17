import json
import random
from time import sleep
import requests
import multiprocessing


# Stress test 1
# def test_many_requests():
#     for _ in range(10000):
#         response = requests.get("http://localhost:8000/train")
#         assert response.status_code == 200


class RandomRequestProcess(multiprocessing.Process):
    def __init__(self):
        multiprocessing.Process.__init__(self)
        self.data = multiprocessing.Value("i", 0)
        self.possible_requests = [
            "train",
            "train/1",
            "train/1/seat",
            "train/1/location",
            "ticket",
        ]

    def run(self):
        for _ in range(10000):
            endpoint = random.choice(self.possible_requests)
            response = requests.get(
                "http://localhost:8000/" + endpoint,
                headers={"Authorization": "bearer c1"},
            )
            if response.status_code == 200:
                self.data.value += 1


# Stress test 2
# def test_parallel():
#     processes = []
#     for _ in range(2):
#         p = RandomRequestProcess()
#         p.start()
#         processes.append(p)
#     for p in processes:
#         p.join()
#         assert p.data.value == 10000


class TicketOrderingProcess(multiprocessing.Process):
    def __init__(self, user):
        multiprocessing.Process.__init__(self)
        self.data = multiprocessing.Value("i", 0)
        self.possible_seats = [f"{i}-{j}" for i in range(1, 6) for j in range(1, 61)]
        self.tickets = []
        self.user = user

    def run(self):
        for possible_seat in self.possible_seats:
            sleep(random.random() / 100)
            response = requests.post(
                "http://localhost:8000/ticket",
                data=json.dumps({"train_id": 1, "seat": possible_seat}),
                headers={"Authorization": "bearer " + self.user},
            )
            if response.status_code == 200:
                self.data.value += 1
                self.tickets.append(response.json()["id"])
        for ticket in self.tickets:
            response = requests.delete(
                "http://localhost:8000/ticket/" + ticket,
                headers={"Authorization": "bearer " + self.user},
            )


# Stress test 3
# def test_parallel_ordering():
#     p1 = TicketOrderingProcess("c1")
#     p2 = TicketOrderingProcess("c2")
#
#     p1.start()
#     p2.start()
#
#     p1.join()
#     p2.join()
#
#     assert p1.data.value > 0
#     assert p2.data.value > 0


# Stress test 4
# def test_order_cancel():
#     for _ in range(1000):
#         response = requests.post(
#             "http://localhost:8000/ticket",
#             data=json.dumps({"train_id": 2, "seat": "1-1"}),
#             headers={"Authorization": "bearer c1"},
#         )
#         assert response.status_code == 200
#         ticket = response.json()["id"]
#         response = requests.delete(
#             "http://localhost:8000/ticket/" + ticket,
#             headers={"Authorization": "bearer c1"},
#         )
#         assert response.status_code == 200


# Stress test 5
# def test_many_updates():
#     response = requests.post(
#         "http://localhost:8000/ticket",
#         data=json.dumps({"train_id": 3, "seat": "1-1"}),
#         headers={"Authorization": "bearer c1"},
#     )
#     assert response.status_code == 200
#     ticket = response.json()["id"]
#     seats = [f"{i}-{j}" for i in range(1, 6) for j in range(1, 61)]
#     i = 0
#
#     try:
#         for i in range(1000):
#             seat = seats[i % (len(seats) - 1) + 1]
#             response = requests.put(
#                 "http://localhost:8000/ticket/" + ticket,
#                 data=json.dumps({"seat": seat, "train_id": 3}),
#                 headers={"Authorization": "bearer c1"},
#             )
#             assert response.status_code == 200
#     finally:
#         response = requests.delete(
#             "http://localhost:8000/ticket/" + ticket,
#             headers={"Authorization": "bearer c1"},
#         )
#         assert response.status_code == 200
