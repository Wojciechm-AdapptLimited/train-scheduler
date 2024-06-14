from datetime import datetime
import random
import numpy as np

_format = "%Y-%m-%d %H:%M"
stations = ["Poznań Główny", "Kraków Główny", "Łódź", "Gniezno", "Warszawa"]
seats = [f"{cart}{i}" for cart in "ABCDE" for i in range(10)]
passengers = [
    "Kamil",
    "Porsche",
    "Dawid",
    "Jacek",
    "Robert",
    "Jan",
    "Jarek",
    "Adrian",
    "Natalia",
    "Weronika",
]
tickets = [
    {
        "id": i,
        "stationStart": s1,
        "stationEnd": s2,
        "start": datetime.strptime("2024-6-20 7:30", _format),
        "end": datetime.strptime("2024-6-20 15:30", _format),
        "seats": random.choices(seats, k=5),
        "passengers": [
            {"name": p, "seat": s}
            for p, s in zip(random.choices(passengers, k=5), random.choices(seats, k=5))
        ],
    }
    for i, (s1, s2) in enumerate(zip(stations[:-1], stations[1:]))
]
trains_n = 10
trains = [
    {"x": x, "y": y}
    for x in np.random.uniform(low=50.4683, high=53.8014, size=(trains_n,))
    for y in np.random.uniform(low=14.9841, high=22.637, size=(trains_n,))
]
reservations = 0
