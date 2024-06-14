# Train-scheduler

Repo for Big Data and Distributed Systems project.

The project is done with Cassandra. The topic is a Train scheduler.

The trains periodically send their location and other sensor information to the database.

Using the GUI, user are able to buy normal and reduced tickets for the chosen trains. They are also able to see the last train location.

## Database schema

```mermaid
---
title: train keyspace
---
erDiagram
    TRAIN {
        int id PK
        datetime arrival
        datetime departure
        string from
        string to
    }

    SEAT {
        int train PK
        string seat PK
        boolean occupied
    }

    PASSANGER {
        string login PK
    }

    TICKET {
        string login PK
        uuid id PK
        int train FK
        string seat FK
    }

    TRAIN ||--o{ SEAT : has
    TICKET }o--|| SEAT : for
    TICKET }o--|| TRAIN : for
    PASSANGER ||--o{ TICKET : has
```

## How to run

### GUI

The GUI is a website implemented using React. Simply run:

```bash
npm run dev
```

### API

To run the server api, in the api directory run:

```bash
uvicorn main:app --reload
```

### Fake trains

To emulate the trains run:

```bash
python scripts/run_trains.py
```
