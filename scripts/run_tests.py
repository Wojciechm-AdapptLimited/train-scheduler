from ..api.domain import RequestTrain


def test_1(repeats=10000):

    train = RequestTrain(1, 0, 0, repeats=repeats)

    train.start()

    train.stop()

    train.join()


def test_2(repeats=10000):
    pass