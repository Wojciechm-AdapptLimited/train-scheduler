import psycopg2
from fastapi import FastAPI

app = FastAPI()


class Context:
    def __enter__(self):
        self.conn = psycopg2.connect(
            "dbname=trains user=postgres password=1234 host=localhost port=5432"
        )
        return self.conn.cursor()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.commit()
        self.conn.close()


@app.get("/")
async def root():
    pass


# @app.get("/schedule")
def get_schedules():
    with Context() as cur:
        cur.execute("SELECT * FROM schedule;")
        schedules = cur.fetchall()
    return schedules


print(get_schedules())
