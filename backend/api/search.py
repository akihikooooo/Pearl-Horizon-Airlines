from fastapi import HTTPException
from fastapi.routing import APIRouter
from pydantic import BaseModel, Field
from datetime import date
from enums.data import RouteStructure


router = APIRouter()

class SearchFlightRequest(BaseModel):
    route: RouteStructure
    origin: str = Field(min_length=3, max_length=64)
    destination: str = Field(min_length=3, max_length=64)
    date: date

@router.post("/message")
async def send_message(payload: SearchFlightRequest):
    print(payload.route)