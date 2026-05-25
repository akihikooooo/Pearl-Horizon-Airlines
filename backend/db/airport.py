from .database import Database 

def getAllAirports():
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT * FROM airport")
    data = cur.fetchall()
    ret = {}
    for airport in data:
        ret[airport[0]] = {"country": airport[1], "city": airport[2]}
    return ret

def addAirport(payload):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "INSERT INTO airport (airport_id, country, city) VALUES (?, ?, ?)",
        (payload.airport_id, payload.country, payload.city),
    )
    con.commit()

def deleteAirport(airport_id: str):
    con = Database().con
    cur = con.cursor()

    cur.execute(
        "SELECT COUNT(*) FROM flight WHERE origin_airport_id = ? OR destination_airport_id = ?",
        (airport_id, airport_id),
    )
    if cur.fetchone()[0] > 0:
        return "has_flights"

    cur.execute("DELETE FROM airport WHERE airport_id = ?", (airport_id,))
    if cur.rowcount == 0:
        return "not_found"

    con.commit()
    return "ok"