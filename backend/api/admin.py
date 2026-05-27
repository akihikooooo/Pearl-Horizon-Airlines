import logging
import sqlite3

from auth import verify_token
from db import airplane, airport, booking, flight, users, review
from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, List, Literal

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()

class PermissionsModel(BaseModel):
    perms: str

@router.get("/permitted")
def check_admin_permission(payload: PermissionsModel, token: dict = Depends(verify_token)):
    # TODO: do a js return for like, {perm1: true, perm2: false}
    return users.userHasPerms(token["user_id"], payload.perms)


class DashboardReturnModel(BaseModel):
    total_users: int
    total_flights: int
    total_booked_seats: int
    next_flight: Dict[str, str | int] | None
    airports_available: Dict[str, Dict[str, str]]
    airplanes_available: Dict[str, Dict[str, str | int]]
    users: List[Dict[str, str | None]]
    flights: List[Dict[str, str | int | None]]
    booking_pending: List[Dict[str, str | int | None]]
    reviews: List[Dict[str, str | int | None]]


@router.get("/dashboard")
def getDashboardData(token: dict = Depends(verify_token)):
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        return HTTPException(status_code=401, detail="Not an Administrator")
    ret = DashboardReturnModel(
        total_users=users.fetchTotalUsers(),
        total_flights=flight.fetchTotalFlights(),
        total_booked_seats=booking.fetchTotalBooking(),
        next_flight=flight.fetchNextFlight(),
        airports_available=airport.getAllAirports(),
        airplanes_available=airplane.getAllAirplanes(),
        users=users.getAllUsers(),
        flights=flight.fetchAllFlights(),
        booking_pending=booking.fetchPendingBookings(),
        reviews=review.fetchAllReviews()
    )
    return ret


class AddAirportModel(BaseModel):
    airport_id: str
    country: str
    city: str


@router.post("/add/airport")
def add_airport(payload: AddAirportModel, token: dict = Depends(verify_token)):
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        return HTTPException(status_code=401, detail="Not an Administrator")
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
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        return HTTPException(status_code=401, detail="Not an Administrator")
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
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        return HTTPException(status_code=401, detail="Not an Administrator")
    try:
        flight.addFlight(payload)
        return {"success": True}
    except sqlite3.IntegrityError as e:
        print(e)
        raise HTTPException(status_code=409, detail="Airport ID already exists")


class ModifyUserModel(BaseModel):
    user: str
    field: Literal["first_name", "last_name", "password", "permissions"]
    value: str


@router.post("/modify/user")
def modify_user(payload: ModifyUserModel, token: dict = Depends(verify_token)):
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        return HTTPException(status_code=401, detail="Not an Administrator")
    try:
        users.modifyUser(payload)
        return {"success": True}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Airport ID already exists")

@router.get("/payment/{booking_id}")
def getPaymentDetails(booking_id: str, token: dict = Depends(verify_token)):
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        raise HTTPException(status_code=401, detail="Not an Administrator")

    payment = booking.fetchPaymentByBookingId(booking_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Booking not found")

    return payment

class UpdatePaidStatusParams(BaseModel):
    booking_id: str
    paid: int = Field(..., ge=-1, le=1)

@router.patch("/payment/status")
def updatePaymentStatus(payload: UpdatePaidStatusParams, token: dict = Depends(verify_token)):
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        raise HTTPException(status_code=401, detail="Not an Administrator")

    if not booking.updatePaidStatus(payload.booking_id, payload.paid):
        raise HTTPException(status_code=404, detail="Booking not found")

    return {"success": True, "booking_id": payload.booking_id, "paid": payload.paid}

@router.delete("/delete/flight/{flight_id}")
def deleteFlightEndpoint(flight_id: str, token: dict = Depends(verify_token)):
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        raise HTTPException(status_code=401, detail="Not an Administrator")

    result = flight.deleteFlight(flight_id)
    if result == "not_found":
        raise HTTPException(status_code=404, detail="Flight not found")
    if result == "has_bookings":
        raise HTTPException(status_code=409, detail="Cannot delete a flight with existing bookings")

    return {"success": True, "flight_id": flight_id}

@router.delete("/delete/airplane/{airplane_id}")
def deleteAirplaneEndpoint(airplane_id: str, token: dict = Depends(verify_token)):
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        raise HTTPException(status_code=401, detail="Not an Administrator")

    result = airplane.deleteAirplane(airplane_id)
    if result == "not_found":
        raise HTTPException(status_code=404, detail="Airplane not found")
    if result == "has_flights":
        raise HTTPException(status_code=409, detail="Cannot delete an airplane assigned to existing flights")

    return {"success": True, "airplane_id": airplane_id}

@router.delete("/delete/airport/{airport_id}")
def deleteAirportEndpoint(airport_id: str, token: dict = Depends(verify_token)):
    if not users.userHasPerms(token["user_id"], "ADMINISTRATOR"):
        raise HTTPException(status_code=401, detail="Not an Administrator")

    result = airport.deleteAirport(airport_id)
    if result == "not_found":
        raise HTTPException(status_code=404, detail="Airport not found")
    if result == "has_flights":
        raise HTTPException(status_code=409, detail="Cannot delete an airport referenced by existing flights")

    return {"success": True, "airport_id": airport_id}