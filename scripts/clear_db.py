import psycopg2

conn = psycopg2.connect(
    "dbname=trains user=postgres password=1234 host=localhost port=5432"
)

cur = conn.cursor()

cur.execute("DROP TABLE ticket;")
cur.execute("DROP TABLE schedule;")
cur.execute("DROP TABLE seat;")
cur.execute("DROP TABLE train;")
cur.execute("DROP TABLE customer;")

cur.close()
conn.commit()
conn.close()
