import logging
from typing import Annotated, List
import uuid
from db.booking import bookPassengers, getTakenSeats
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
    ret = getTakenSeats(payload.flight_id)
    return JSONResponse(content={"taken_seats": ret})


class PassengerParams(BaseModel):
    title: str = Field(min_length=1, max_length=3)
    first_name: str = Field(min_length=1)
    middle_name: str  # unused
    last_name: str = Field(min_length=1)
    gender: str = Field(min_length=1)
    date_of_birth: str = Field(min_length=1)
    email: str = Field(pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    phone_number: str = Field(pattern=r"^(\+639|09)\d{9}$")
    emergency_contact_name: str = Field(min_length=1)
    emergency_phone_number: str = Field(pattern=r"^(\+639|09)\d{9}$")
    selected_seat: str = Field(pattern=r"^([1-9]|[12]\d|3[0-5])[A-J]$")
    meal_preference: str


class BookEntryParams(BaseModel):
    flight_id: str
    amount_due: float
    passengers: List[PassengerParams]


@router.post("/entry")
def book_passengers(payload: BookEntryParams, token: dict = Depends(verify_token)):
    bookPassengers(payload, token["user_id"])  # TODO: error handling
    return {"success": True}
