from .database import Database 

def userPerms(userId):
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT permissions FROM users WHERE user_id=?", (userId,))
    perms = cur.fetchone()[0]
    return perms

def fetchUserFromCredentials(email, password):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "SELECT user_id FROM users WHERE (email IS ? AND password IS ?);",
        (
            email,
            password,
        ),
    )
    user = cur.fetchone()
    return user

def fetchUserFromId(user_id):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "SELECT first_name, last_name, permissions FROM users WHERE (user_id IS ?)",
        (user_id,),
    )
    ret = cur.fetchone()  
    return ret

def createUser(userId, payload):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "INSERT INTO users (user_id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
        (
            userId,
            payload.first_name,
            payload.last_name,
            payload.email,
            payload.password,
        ),
    )
    con.commit()