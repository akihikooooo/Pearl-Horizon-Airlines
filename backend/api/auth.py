from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Cookie, Response
from fastapi.security import HTTPBearer
from pydantic import BaseModel

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
    # Verify credentials (check database)
    if payload.email == "admin" and payload.password == "password":
        token = create_cookie(payload.email)
        response.set_cookie(
            key="token",
            value=token,
            secure=False,  # Set True in production with HTTPS
            samesite="lax",
            max_age=24 * 60 * 60,
        )
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/check")
async def protected_route(payload: dict = Depends(verify_token)):
    return {"user_id": "admin"}
