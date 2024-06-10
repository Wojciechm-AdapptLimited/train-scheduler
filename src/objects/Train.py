import threading
import time
import random
import math


class Train(threading.Thread):
    def __init__(self, train_id, delay=None):
        super(Train, self).__init__()
        self.train_id = train_id
        self.running = True
        self._delay = delay

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
            delay = random.uniform(0, 4)
        return delay

    def run(self):
        while self.running:
            info = self.generate_info()
            time.sleep(self.delay)
            self.send_info(info)

    def stop(self):
        self.running = False


class TestTrain(Train):
    def __init__(self, train_id, delay=None):
        super(TestTrain, self).__init__(train_id, delay)
        self.t = 0

    def generate_info(self):
        x, y = math.sin(self.t), math.sin(self.t)

        self.t += 1

        return {"x": x, "y": y}

    def send_info(self, info):
        print(self.train_id, info)
