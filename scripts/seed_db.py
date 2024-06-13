import psycopg2

conn = psycopg2.connect(
    "dbname=trains user=postgres password=1234 host=localhost port=5432"
)

cur = conn.cursor()

cur.execute("CREATE TABLE train (id serial PRIMARY KEY, name VARCHAR);")

cur.execute(
    "CREATE TABLE seat (id serial PRIMARY KEY, train INTEGER, cart INTEGER, seat_number INTEGER, FOREIGN KEY (train) REFERENCES train(id));"
)

cur.execute("CREATE TABLE customer (login VARCHAR PRIMARY KEY);")

cur.execute(
    "CREATE TABLE schedule (id serial PRIMARY KEY, train INTEGER, departure_time TIMESTAMP,  arrival_time TIMESTAMP, FOREIGN KEY (train) REFERENCES train(id));"
)

cur.execute(
    "CREATE TABLE ticket (id serial PRIMARY KEY, customer VARCHAR, seat INTEGER, schedule INTEGER, FOREIGN KEY (customer) REFERENCES customer(login), FOREIGN KEY (seat) REFERENCES seat(id), FOREIGN KEY (schedule) REFERENCES schedule(id));"
)

for i in range(1, 11):
    cur.execute(f"INSERT INTO train (name) VALUES ('train_{i}');")

for i in range(1, 11):
    for j in range(1, 11):
        for k in range(1, 61):
            cur.execute(
                f"INSERT INTO seat (train, cart, seat_number) VALUES ({i}, {j}, {k});"
            )

for i in range(1, 11):
    for j in range(1, 10):
        date = i if i > 9 else f"0{i}"

        cur.execute(
            f"INSERT INTO schedule (train, departure_time, arrival_time) VALUES ({i}, '2024-01-{date} 0{j}:00:00', '2024-01-{date} 1{j}:00:00');"
        )

for i in range(1, 5):
    cur.execute(f"INSERT INTO customer (login) VALUES ('customer_{i}');")


cur.close()
conn.commit()
conn.close()
