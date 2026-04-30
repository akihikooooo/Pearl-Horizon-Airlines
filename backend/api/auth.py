from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Cookie, Response
from fastapi.security import HTTPBearer
from pydantic import BaseModel
import uuid
import db
from sqlite3 import IntegrityError

app = APIRouter()
security = HTTPBearer()

SECRET_KEY = "putanginamotalaganatamadpakogumawangproperprovatekeyparadito<3"
ALGORITHM = "HS256"


def create_cookie(user_id: str):
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: Optional[str] = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
async def login(payload: LoginRequest, response: Response):
    con = db.Database().con
    cur = con.cursor()
    cur.execute(
        "SELECT user_id, first_name, middle_name, last_name FROM users WHERE (email IS ? AND password IS ?);",
        (
            payload.email,
            payload.password,
        )
    )
    user = cur.fetchone()
    print(user)
    if user:
        token = create_cookie(user[0])
        response.set_cookie(
            key="token",
            value=token,
            secure=False,  # Set True in production with HTTPS
            samesite="lax",
            max_age=24 * 60 * 60,
        )
        return {"status": "success"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


class SignupRequest(BaseModel):
    email: str
    password: str
    first_name: str
    middle_name: str
    last_name: str


@app.post("/signup")
async def signup(payload: SignupRequest):
    con = db.Database().con
    cur = con.cursor()
    userId = str(uuid.uuid4())
    try:
        cur.execute(
            "INSERT INTO users (user_id, first_name, middle_name, last_name, email, password) VALUES (?, ?, ?, ?, ?, ?)",
            (
                userId,
                payload.first_name,
                payload.middle_name,
                payload.last_name,
                payload.email,
                payload.password,
            ),
        )
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Duplicate Entries")
    con.commit()

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="token")
    return {"status": "success"}

@app.get("/check")
async def protected_route(payload: dict = Depends(verify_token)):
    return {"user_id": payload["user_id"]
    
    }
