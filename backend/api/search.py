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
    returndate: Optional[date] = None


@router.get("/flights")
async def get_all_channels(payload: Annotated[SearchFlightParams, Query()]):
    con = db.Database().con
    cur = con.cursor()
    cur.execute(
        """
            SELECT departure_timestamp,
                   flight_time,
                   (SELECT seats_economy FROM airplane WHERE airplane.airplane_id = flight.airplane_id) - booked_economy AS available_economy,
                   (SELECT seats_business FROM airplane WHERE airplane.airplane_id = flight.airplane_id) - booked_business AS available_business,
                   (SELECT seats_first FROM airplane WHERE airplane.airplane_id = flight.airplane_id) - booked_first AS available_first, 
                   flight_id,
                   origin_airport_id,
                   destination_airport_id
            FROM flight
            WHERE route=? AND origin_airport_id=? AND destination_airport_id=?;
        """,
        (payload.route.lower(), payload.origin.upper(), payload.destination.upper()),
    )
    ret = cur.fetchall()
    response = []
    for i in ret:
        response.append(
            {
                "departure_timestamp": i[0],
                "flight_time": i[1],
                "economy": i[2],
                "business": i[3],
                "first": i[4],
                "flight_id": i[5],
                "origin_airport_id": i[6],
                "destination_airport_id": i[7],
            }
        )
    return JSONResponse(
        content=response,
        status_code=status.HTTP_200_OK,
    )
