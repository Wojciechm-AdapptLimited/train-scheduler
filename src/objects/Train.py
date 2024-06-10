import threading
import time
import random
import math

# import asyncio
# import websockets


class Train(threading.Thread):
    def __init__(self, train_id, delay=None, max_delay=4):
        super(Train, self).__init__()
        self.train_id = train_id
        self.running = True
        self._delay = delay
        self.max_delay = max_delay

    def generate_info(self):
        """
            Generates informations from sensors
        """

        ...

    def send_info(self, info):
        """
            Sends info to database
        """
        ...

    @property
    def delay(self):
        delay = self._delay
        if delay is None:
            delay = random.uniform(0, self.max_delay)
        return delay

    def run(self):
        while self.running:
            info = self.generate_info()
            time.sleep(self.delay)
            self.send_info(info)

    def stop(self):
        self.running = False


class TestTrain(Train):
    def __init__(self, train_id, delay=None, max_delay=4):
        super(TestTrain, self).__init__(train_id, delay, max_delay)
        self.t = 0
        self.poland_coords = {
            "up-left": [53.8014, 14.9841],
            "down-right": [50.4683, 22.637],
            "center": [52.3246, 18.9967]
        }

    def generate_info(self):

        x1, y1 = self.poland_coords["up-left"]
        x2, y2 = self.poland_coords["down-right"]
        xc, yc = self.poland_coords["center"]

        xlen, ylen = abs(x2-x1)/2, abs(y2-y1)/2

        x, y = math.sin(self.t), math.sin(self.t)

        self.t += 1

        return {"x": (x*xlen)+xc, "y": (y*ylen)+yc}

    def send_info(self, info):
        print(self.train_id, info)


# class SocketTrain(TestTrain):
#     def __init__(self, train_id, delay=None, max_delay=4):
#         super(SocketTrain, self).__init__(train_id, delay, max_delay)

#     def send_info(self, info):
#         return super().send_info(info)
