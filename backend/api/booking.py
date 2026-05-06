import logging
from typing import Annotated

import db
from auth import verify_token
from fastapi import Depends, Query
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from pydantic import BaseModel, Field

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()


class AvailableSeatParams(BaseModel):
    flight_id: str = Field(pattern=r"PH[0-9]{4}")


@router.get("/seats")
def get_available_seats(
    payload: Annotated[AvailableSeatParams, Query()],
    token: dict = Depends(verify_token),
):
    con = db.Database().con
    cur = con.cursor()
    cur.execute(
        "SELECT seat_no FROM booking WHERE flight_id IS ?;", (payload.flight_id,)
    )
    ret = [item for sublist in cur.fetchall() for item in sublist]
    return JSONResponse(content={"taken_seats": ret})
