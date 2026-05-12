from .database import Database


def userPerms(userId):
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT permissions FROM users WHERE user_id=?", (userId,))
    perms = cur.fetchone()[0]
    return perms


def hasAdminPermissions(userId):
    perms = userPerms(userId)
    if perms and "ADMINISTRATOR" in perms.split(" "):
        return True
    else:
        return False


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
        "SELECT first_name, last_name, permissions, email FROM users WHERE (user_id IS ?)",
        (user_id,),
    )
    ret = cur.fetchone()
    return ret


def fetchTotalUsers():
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT COUNT(*) FROM users;")
    ret = cur.fetchone()
    return ret[0]


def getAllUsers():
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT first_name, last_name, email FROM users")
    data = cur.fetchall()
    ret = []
    for airplane in data:
        ret.append({"name": f"{airplane[0]} {airplane[1]}", "email": airplane[2]})
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


def modifyUser(payload):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        f"UPDATE users SET {payload.field} = :value WHERE email == :user",
        payload.model_dump(),
    )
    con.commit()


def modifyUserBatch(payload, user_id):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "UPDATE users SET first_name = :first_name, last_name=:last_name, email = :email WHERE user_id == :user_id",
        {**payload.model_dump(), "user_id": user_id },
    )
    con.commit()

def modifyPassword(payload, user_id):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "UPDATE users SET password = :new_password WHERE password == :old_password AND user_id == :user_id",
        {**payload.model_dump(), "user_id": user_id },
    )
    con.commit()