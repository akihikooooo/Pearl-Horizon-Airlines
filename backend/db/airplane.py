from .database import Database 

def getAllAirplanes():
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT * FROM airplane")
    data = cur.fetchall()
    ret = {}
    for airplane in data:
        ret[airplane[0]] = {"model": airplane[1], "seats": airplane[2]}
    return ret
    
def addAirplane(payload):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "INSERT INTO airplane (airplane_id, airplane_model, seats_economy) VALUES (?, ?, ?)",
        (payload.airplane_id, payload.model, payload.capacity),
    )
    con.commit()

def deleteAirplane(airplane_id: str):
    con = Database().con
    cur = con.cursor()

    cur.execute("SELECT COUNT(*) FROM flight WHERE airplane_id = ?", (airplane_id,))
    if cur.fetchone()[0] > 0:
        return "has_flights"

    cur.execute("DELETE FROM airplane WHERE airplane_id = ?", (airplane_id,))
    if cur.rowcount == 0:
        return "not_found"

    con.commit()
    return "ok"