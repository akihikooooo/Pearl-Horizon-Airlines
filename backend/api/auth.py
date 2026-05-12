import uuid
from datetime import datetime, timedelta
from sqlite3 import IntegrityError

from db.users import fetchUserFromCredentials, fetchUserFromId, createUser
import jwt
from auth import ALGORITHM, SECRET_KEY, verify_token
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import HTTPBearer
from pydantic import BaseModel

app = APIRouter()
security = HTTPBearer()


def create_cookie(user_id: str):
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
async def login(payload: LoginRequest, response: Response):
    user = fetchUserFromCredentials(payload.email, payload.password)
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
    last_name: str


@app.post("/signup")
async def signup(payload: SignupRequest):
    userId = str(uuid.uuid4())
    try:
        createUser(userId, payload)
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Duplicate Entries")


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="token")
    return {"status": "success"}


@app.get("/check")
async def check_credentials(payload: dict = Depends(verify_token)):
    ret = fetchUserFromId(payload["user_id"])
    return {
        "user_id": payload["user_id"],
        "first_name": ret[0],
        "last_name": ret[1],
        "permissions": ret[2]
    }
