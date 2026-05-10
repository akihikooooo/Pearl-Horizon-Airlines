import logging
from typing import Annotated

import db
from auth import verify_token
from fastapi import Depends, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from pydantic import BaseModel, Field

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()



@router.get("/permitted")
def get_available_seats(
    token: dict = Depends(verify_token),
): 
    con = db.Database().con
    cur = con.cursor()
    cur.execute(
        "SELECT permissions FROM users WHERE user_id=?", (token["user_id"],)
    )
    perms = cur.fetchone()[0]
    if perms:
        if "ADMINISTRATOR" in perms.split(" "):
            return True
    else: return False