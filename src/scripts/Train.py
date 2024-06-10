import threading
import time
import random


class Train(threading.Thread):
    def __init__(self, train_id, delay=None):
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
            delay = random.randrange(0, 4, step=0.2)
        return delay

    def run(self):
        while self.running:
            info = self.generate_info()
            time.sleep(self.delay)
            self.send_info(info)

    def stop(self):
        self.running = False
