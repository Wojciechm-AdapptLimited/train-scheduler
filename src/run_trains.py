from objects.Train import TestTrain
import time

NUM_TRAINS = 10


def main():

    trains = [TestTrain(i) for i in range(NUM_TRAINS)]

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
