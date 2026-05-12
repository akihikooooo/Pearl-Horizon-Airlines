import logging
from datetime import datetime
from typing import Annotated, Optional


from db.airport import getAllAirports
from db.airplane import getAllAirplanes
from db.flight import searchFlights
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
    ret = searchFlights(payload.route, payload.origin, payload.destination, payload.departuredate)

    
    return JSONResponse(
        content=ret,
        status_code=status.HTTP_200_OK,
    )

@router.get("/airports")
def get_all_airports():
    ret = getAllAirports()
    return ret
        
@router.get("/airplanes")
def get_all_airplanes():
    ret = getAllAirplanes()
    return ret
        