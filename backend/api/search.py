import logging
from datetime import datetime
from typing import Annotated, Optional

import db
from fastapi import Query, status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from pydantic import BaseModel

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()


class SearchFlightParams(BaseModel):
    route: str
    origin: str
    destination: str
    departuredate: datetime
    returndate: Optional[datetime] = None


@router.get("/flights")
async def get_all_flights(payload: Annotated[SearchFlightParams, Query()]):
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
            FROM flight WHERE
                        route=:route
                    AND origin_airport_id=:origin
                    AND destination_airport_id=:destination
                    AND departure_timestamp BETWEEN :departure AND (:departure+86400);
        """,
        {
            "route": payload.route.lower(),
            "origin": payload.origin.upper(),
            "destination": payload.destination.upper(),
            "departure": int(payload.departuredate.timestamp()),
        },
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
