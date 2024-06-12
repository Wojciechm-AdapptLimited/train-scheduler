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
classDiagram 
    direction LR
    class train {
        id: str (PRIMARY KEY)
        title: str
        author: str
    }
    
    class user {
        login: str (PRIMARY KEY)
    }
    
    class ticket_id {
        train_id: str (PRIMARY KEY)
        start_station: str
        end_station: str
        start_time: Date
        end_time: Date
    }

    class reservations{
        id: str (PRIMARY KEY)
        train_id: str (SECONDARY KEY)
        user_login: str
        normal_tickets: int
        reduced_tickets: int
    }
```

## How to run

### GUI
The GUI is a website implemented using React. Simply run in the gui folder:
```bash
npm start
```
### Fake trains

To emulate the trains run:
```bash
py src/run_trains.py
```
