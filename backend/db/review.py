# from pydantic import BaseModel, Field
from .database import Database

def addReview(payload):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "INSERT INTO reviews (rating, comments) VALUES (?, ?)",
        (payload.rating, payload.comments),
    )
    con.commit()

def fetchAllReviews():
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT * FROM reviews;")
    data = cur.fetchall()
    ret = []
    for review in data:
        ret.append({
            "rating": review[0],
            "comments": review[1],
        })
    return ret