from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
import jwt

app = APIRouter()
security = HTTPBearer()

SECRET_KEY = "putanginamotalaganatamadpakogumawangproperprovatekeyparadito<3"
ALGORITHM = "HS256"


def create_token(user_id: str):
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.post("/login")
async def login(username: str, password: str):
    # Verify credentials (check database)
    if username == "admin" and password == "password":
        token = create_token(username)
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/protected")
async def protected_route(payload: dict = Depends(verify_token)):
    return {"user_id": payload["user_id"], "message": "Access granted"}
