import logging
from datetime import date
from typing import Annotated, Optional

import db
from fastapi import HTTPException, Query, status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from pydantic import BaseModel

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()


class SearchFlightParams(BaseModel):
    route: str
    origin: str
    destination: str
    departuredate: date
    returndate: Optional[date]


@router.get("/flights")
async def get_all_channels(payload: Annotated[SearchFlightParams, Query()]):
    con = db.Database().con
    cur = con.cursor()
    cur.execute(
        "SELECT departure_timestamp, flight_time FROM flight WHERE route=? AND origin_airport_id=? AND destination_airport_id=?;",
        (payload.route, payload.origin, payload.destination),
    )
    ret = cur.fetchall()
    response = []
    for i in ret:
        response.append({
            "departure_timestamp": i[0],
            "flight_time": i[1]
        })
    return JSONResponse(
        content=response,
        status_code=status.HTTP_200_OK,
    )
