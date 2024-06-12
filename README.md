# Train-scheduler

Repo for Big Data and Distributed Systems project.

The project is done with Cassandra and Postgres. The topic is a Train scheduler.

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
        string name UK
    }

    SEAT {
        int id PK
        int train FK
        int cart
        int number
    }

    USER {
        string login PK
    }

    STATION {
        int id PK
        string name UK
    }

    SCHEDULE {
        int id PK
        int station FK
        int train FK
        date arrival
        date departure
    }

    TICKET {
        int id PK
        string user FK
        boolean reduced
    }

    RESERVATION {
        int id PK
        int seat FK
        int schedule FK
        int ticket FK
    }

    TRAIN ||--o{ SEAT : has
    SCHEDULE }o--|| TRAIN : for
    SCHEDULE }o--|| STATION : for
    RESERVATION }o--|| SEAT : for
    RESERVATION }o--|| SCHEDULE : for
    RESERVATION }|--o{ TICKET : has
    USER ||--o{ TICKET : has
```

## How to run

### GUI

The GUI is a website implemented using React. Simply run:

```bash
npm run dev
```

### Fake trains

To emulate the trains run:

```bash
python scripts/run_trains.py
```
