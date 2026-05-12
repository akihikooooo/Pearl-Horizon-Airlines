from .database import Database 

def searchFlights(route, origin, destination, departuredate):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        """
            SELECT departure_timestamp,
                   flight_time,
                   (SELECT seats_economy FROM airplane WHERE airplane.airplane_id = flight.airplane_id) - booked_economy AS available_economy,
                   (SELECT seats_business FROM airplane WHERE airplane.airplane_id = flight.airplane_id) - booked_business AS available_business,
                   (SELECT seats_first FROM airplane WHERE airplane.airplane_id = flight.airplane_id) - booked_first AS available_first, 
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
    ret = cur.fetchall()
    return ret