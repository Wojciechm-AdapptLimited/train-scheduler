import abc
import math
import random
import threading
import time
import requests

# import asyncio
# import websockets


class Train(abc.ABC, threading.Thread):
    def __init__(self, train_id, delay=None, max_delay=4, repeats=None):
        super(Train, self).__init__()
        self.train_id = train_id
        self.running = True
        self._delay = delay
        self.max_delay = max_delay
        self.repeats = repeats
    
    @property
    def perpetual(self):
        return self.repeats is None

    @abc.abstractmethod
    def generate_info(self) -> dict[str, float]:
        """
        Generates informations from sensors
        """
        pass

    @abc.abstractmethod
    def send_info(self, info) -> None:
        """
        Sends info to database
        """
        pass

    @property
    def delay(self) -> float:
        return self._delay or random.uniform(0, self.max_delay)

    def train_iter(self) -> None:
        info = self.generate_info()
        time.sleep(self.delay)
        self.send_info(info)

    def start(self) -> None:
        if self.perpetual:
            while self.running:
                self.train_iter()
            return None
        
        for i in range(self.repeats):
            self.train_iter()

    def stop(self) -> None:
        self.running = False


class PositionTrain(Train):
    def __init__(self, train_id, delay=None, max_delay=4):
        super(PositionTrain, self).__init__(train_id, delay, max_delay)
        self.t = 0
        self.poland_coords = {
            "up-left": [53.8014, 14.9841],
            "down-right": [50.4683, 22.637],
            "center": [52.3246, 18.9967],
        }

    def generate_info(self):
        x1, y1 = self.poland_coords["up-left"]
        x2, y2 = self.poland_coords["down-right"]
        xc, yc = self.poland_coords["center"]

        xlen, ylen = abs(x2 - x1) / 2, abs(y2 - y1) / 2

        x, y = math.sin(self.t), math.sin(self.t)

        self.t += 1

        return {"x": (x * xlen) + xc, "y": (y * ylen) + yc}

    def send_info(self, info):
        print(self.train_id, info)

#
#server_ip = '127.0.0.'
#ports = ["9042", '9043', '9044']
#cluster_ips = [f'{server_ip}:{port}' for port in ports]


class RequestTrain(PositionTrain):
    def __init__(self, train_id, delay=None, max_delay=4, repeats=None):
        super(RequestTrain, self).__init__(train_id, delay, max_delay, repeats)
        self.url = "127.0.0.1/"

    def send_info(self, info):
        _ = requests.post(self.url+"train/position", json={
            "id": self.train_id,
            "x": info.x,
            "y": info.y
        })

    #     self.db = cassandra.cluster.Cluster(
    #         [f"127.0.0.{i}" for i in range(1, 4)],
    #         port=9042)
    #     self.session = self.db.connect('train')

    # def send_info(self, info):
    #     query = f'INSERT INTO trains (train_id, x, y) VALUES ({self.train_id},{info.x},{info.y})'
    #     self.session.execute(query)