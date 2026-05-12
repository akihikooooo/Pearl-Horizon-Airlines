import logging
import sqlite3

from db.airport import addAirport
from auth import verify_token
from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from pydantic import BaseModel

from db.users import userPerms

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()


@router.get("/permitted")
def check_admin_permission(
    token: dict = Depends(verify_token),
):
    perms = userPerms(token["user_id"])
    if perms:
        if "ADMINISTRATOR" in perms.split(" "):
            return True
    else:
        return False


class AddAirportModel(BaseModel):
    airport_id: str
    country: str
    city: str


@router.post("/add/airport")
def add_airport(payload: AddAirportModel, token: dict = Depends(verify_token)):
    try:
        addAirport(payload)
        return {"success": True}
    except sqlite3.IntegrityError:
        return HTTPException(status_code=409, detail="Airport ID already exists")
