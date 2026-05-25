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