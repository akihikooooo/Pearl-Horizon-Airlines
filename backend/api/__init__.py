from datetime import datetime, timedelta

import jwt
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .router import api_router

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://192.168.100.8:5173",
    "http://10.172.210.213:5173"  # for dev
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




app.include_router(router=api_router, prefix="/api")
