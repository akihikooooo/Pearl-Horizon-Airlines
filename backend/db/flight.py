from .database import Database
from time import time


def searchFlights(route, origin, destination, departuredate):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        """
            SELECT departure_timestamp,
                   flight_time,
                   (SELECT seats_economy FROM airplane WHERE airplane.airplane_id = flight.airplane_id) - booked_economy AS available_economy,
                   flight_id,
                   origin_airport_id,
                   destination_airport_id
            FROM flight WHERE
                        route=:route
                    AND origin_airport_id=:origin
                    AND destination_airport_id=:destination
                    AND departure_timestamp BETWEEN :departure AND (:departure+86400);
        """,
        {
            "route": route.lower(),
            "origin": origin.upper(),
            "destination": destination.upper(),
            "departure": int(departuredate.timestamp()),
        },
    )
    response = []
    for i in cur.fetchall():
        response.append(
            {
                "departure_timestamp": i[0],
                "flight_time": i[1],
                "economy": i[2],
                "flight_id": i[3],
                "origin_airport_id": i[4],
                "destination_airport_id": i[5],
            }
        )
    return response


def fetchNextFlight():
    con = Database().con
    cur = con.cursor()

    cur.execute(
        "SELECT flight_id, departure_timestamp FROM flight WHERE (departure_timestamp > :now) ORDER BY departure_timestamp ASC LIMIT 1",
        {"now": int(time())},
    )
    ret = cur.fetchone()
    if ret:
        return {"flight_id": ret[0], "departure_timestamp": ret[1]}
    else:
        return None


def fetchTotalFlights():
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT COUNT(*) FROM flight;")
    ret = cur.fetchone()
    return ret[0]


def fetchAllFlights():
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT * FROM flight ORDER BY departure_timestamp DESC")
    response = []
    for i in cur.fetchall():
        response.append(
            {
                "departure_timestamp": i[6],
                "flight_time": i[8],
                "economy": i[4],
                "flight_id": i[0],
                "origin_airport_id": i[1],
                "destination_airport_id": i[2],
                "airplane_id": i[3],
                "route": i[5],
                "return_timestamp": i[7],
            }
        )
    return response

def addFlight(payload):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        """INSERT INTO flight (flight_id, origin_airport_id, destination_airport_id, airplane_id, booked_economy, route, departure_timestamp, flight_time) 
        VALUES (:flight_id, :origin_airport, :destination_airport, :airplane_used, 0, :route_type, :departure_time, :flight_time)""",
        payload.model_dump(),
    )
    con.commit()
