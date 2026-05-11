import logging
from typing import Annotated, List
import uuid
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
    con = db.Database().con
    cur = con.cursor()
    print(token)
    cur.executemany(
        """
    INSERT INTO booking (title, first_name, last_name, gender, date_of_birth, email, phone_number, emergency_contact_name, emergency_phone_number, meal_preference, booking_id, user_id, flight_id, seat_no, amount_due, paid)
    VALUES ( :title, :first_name, :last_name, :gender, :date_of_birth, :email, :phone_number, :emergency_contact_name, :emergency_phone_number, :meal_preference, :booking_id, :user_id, :flight_id, :selected_seat, :amount_due, :paid)
    """,
        [
            {
                **p.model_dump(),
                "booking_id": str(uuid.uuid4()),
                "user_id": token["user_id"],
                "flight_id": payload.flight_id,
                "amount_due": payload.amount_due,
                "paid": 0
            }
            for p in payload.passengers
        ],
    )
    con.commit()
    return {"success": True}
