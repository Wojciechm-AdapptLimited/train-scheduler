import abc
import math
import random
import threading
import time

import requests

NUM_TRAINS = 10


class Train(abc.ABC, threading.Thread):
    def __init__(self, train_id, delay=None, max_delay=4, repeats=None):
        super(Train, self).__init__()
        self.train_id = train_id
        self.running = True
        self._delay = delay
        self.max_delay = max_delay
        self.repeats = repeats

    @abc.abstractmethod
    def generate_info(self) -> tuple[float, float]:
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
        i = 0
        while self.running and (self.repeats is None or i < self.repeats):
            i += 1
            self.train_iter()

    def stop(self) -> None:
        self.running = False


class PositionTrain(Train):
    def __init__(self, train_id, delay=None, max_delay=4, repeats=None):
        super(PositionTrain, self).__init__(train_id, delay, max_delay, repeats)
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

        return (x * xlen) + xc, (y * ylen) + yc

    def send_info(self, info):
        print(self.train_id, info)


class RequestTrain(PositionTrain):
    def __init__(self, train_id, delay=None, max_delay=4, repeats=None):
        super(RequestTrain, self).__init__(train_id, delay, max_delay, repeats)
        self.url = "127.0.0.1/"

    def send_info(self, info):
        _ = requests.post(
            self.url + "train/position",
            json={"id": self.train_id, "x": info.x, "y": info.y},
        )


def main():
    trains = [PositionTrain(i) for i in range(NUM_TRAINS)]

    for train in trains:
        train.start()

    while True:
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            for train in trains:
                train.stop()
            break

    for train in trains:
        train.join()

    return 0


if __name__ == "__main__":
    main()
