import logging
import sqlite3

from auth import verify_token
from db import airplane, airport, booking, flight, users
from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Literal

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()


@router.get("/permitted")
def check_admin_permission(token: dict = Depends(verify_token)):
    return users.hasAdminPermissions(token["user_id"])

class DashboardReturnModel(BaseModel):
    total_users: int
    total_flights: int
    total_booked_seats: int
    next_flight: Dict[str, str|int] | None
    airports_available: Dict[str, Dict[str, str]]
    airplanes_available: Dict[str, Dict[str, str|int]]
    users: List[Dict[str, str]]

@router.get("/dashboard")
def getDashboardData(token: dict = Depends(verify_token)):
    if not users.hasAdminPermissions(token["user_id"]):
        return HTTPException(status_code=401, detail="Not an Administrator")
    ret = DashboardReturnModel(
        total_users = users.fetchTotalUsers(),
        total_flights = flight.fetchTotalFlights(),
        total_booked_seats = booking.fetchTotalBooking(),
        next_flight = flight.fetchNextFlight(),
        airports_available = airport.getAllAirports(),
        airplanes_available = airplane.getAllAirplanes(),
        users = users.getAllUsers()
    )
    return ret


class AddAirportModel(BaseModel):
    airport_id: str
    country: str
    city: str


@router.post("/add/airport")
def add_airport(payload: AddAirportModel, token: dict = Depends(verify_token)):
    try:
        airport.addAirport(payload)
        return {"success": True}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Airport ID already exists")

class AddAirplaneModel(BaseModel):
    airplane_id: str
    model: str
    capacity: int


@router.post("/add/airplane")
def add_airplane(payload: AddAirplaneModel, token: dict = Depends(verify_token)):
    try:
        airplane.addAirplane(payload)
        return {"success": True}
    except sqlite3.IntegrityError as e:
        print(e)
        raise HTTPException(status_code=409, detail="Airplane ID already exists")

class AddFlightModel(BaseModel):
    flight_id: str
    origin_airport: str
    destination_airport: str
    airplane_used: str
    route_type: str
    departure_time: int
    flight_time: int

@router.post("/add/flight")
def add_flight(payload: AddFlightModel, token: dict = Depends(verify_token)):
    try:
        flight.addFlight(payload)
        return {"success": True}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Airport ID already exists")

class ModifyUserModel(BaseModel):
    user: str
    field:  Literal["first_name", "last_name", "password", "permissions"]
    value: str

@router.post("/modify/user")
def modify_user(payload: ModifyUserModel, token: dict = Depends(verify_token)):
    try:
        users.modifyUser(payload)
        return {"success": True}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Airport ID already exists")
