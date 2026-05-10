import logging
from typing import Annotated

import sqlite3
import db
from auth import verify_token
from fastapi import Depends, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from pydantic import BaseModel, Field

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()


@router.get("/permitted")
def check_admin_permission(
    token: dict = Depends(verify_token),
):
    con = db.Database().con
    cur = con.cursor()
    cur.execute("SELECT permissions FROM users WHERE user_id=?", (token["user_id"],))
    perms = cur.fetchone()[0]
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
    con = db.Database().con
    cur = con.cursor()
    try:
        cur.execute(
            "INSERT INTO airport (airport_id, country, city) VALUES (?, ?, ?)",
            (payload.airport_id, payload.country, payload.city),
        )
        con.commit()
        return {"success": True}
    except sqlite3.IntegrityError:
        return HTTPException(status_code=409, detail="Airport ID already exists")
