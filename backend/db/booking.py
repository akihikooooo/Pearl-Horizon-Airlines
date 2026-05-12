from .database import Database
import uuid
from pydantic import BaseModel
from time import time


class bookedFlightModel(BaseModel):
    booking_id: str
    flight_id: str
    origin_airport_id: str
    destination_airport_id: str
    flight_time: int
    departure_timestamp: int
    seat_no: str
    title: str
    first_name: str
    last_name: str


def bookPassengers(payload, userId):
    con = Database().con
    cur = con.cursor()
    cur.executemany(
        """
    INSERT INTO booking (title, first_name, last_name, gender, date_of_birth, email, phone_number, emergency_contact_name, emergency_phone_number, meal_preference, booking_id, user_id, flight_id, seat_no, amount_due, paid)
    VALUES ( :title, :first_name, :last_name, :gender, :date_of_birth, :email, :phone_number, :emergency_contact_name, :emergency_phone_number, :meal_preference, :booking_id, :user_id, :flight_id, :selected_seat, :amount_due, :paid)
    """,
        [
            {
                **p.model_dump(),
                "booking_id": str(uuid.uuid4()),
                "user_id": userId,
                "flight_id": payload.flight_id,
                "amount_due": payload.amount_due,
                "paid": 0,
            }
            for p in payload.passengers
        ],
    )
    cur.execute(
        "UPDATE flight SET booked_economy = booked_economy + ? WHERE flight_id == ?;",
        (len(payload.passengers), payload.flight_id),
    )
    con.commit()


def fetchBookedFlightsFromUser(user_id):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        """
            SELECT booking.booking_id, booking.flight_id, booking.seat_no, booking.title, booking.first_name, booking.last_name,
                   flight.origin_airport_id, flight.destination_airport_id, flight.flight_time, flight.departure_timestamp 
            FROM booking LEFT JOIN flight ON booking.flight_id = flight.flight_id WHERE user_id=? AND flight.departure_timestamp > ? ORDER BY flight.departure_timestamp ASC """,
        (user_id, time()),
    )
    flightRet = cur.fetchall()
    response = []
    for booking in flightRet:
        response.append(
            bookedFlightModel(
                booking_id=booking[0],
                flight_id=booking[1],
                seat_no=booking[2],
                title=booking[3],
                first_name=booking[4],
                last_name=booking[5],
                origin_airport_id=booking[6],
                destination_airport_id=booking[7],
                flight_time=booking[8],
                departure_timestamp=booking[9],
            )
        )
    return response


def fetchPendingBookings():
    con = Database().con
    cur = con.cursor()
    cur.execute(
        """
            SELECT booking.booking_id, booking.flight_id, booking.seat_no, booking.title, booking.first_name, booking.last_name, booking.amount_due, flight.origin_airport_id, flight.destination_airport_id
            FROM booking LEFT JOIN flight ON booking.flight_id = flight.flight_id WHERE booking.paid == 0  """,
        (),
    )
    flightRet = cur.fetchall()
    response = []
    for booking in flightRet:
        response.append(
            {
                "booking_id": booking[0],
                "flight_id": booking[1],
                "seat_no": booking[2],
                "name": f"{booking[3]}. {booking[4]} {booking[5]}",
                "amount_due": booking[6],
                "route": f"{booking[7]} - {booking[8]}"
            }
        )
    return response


def getTakenSeats(flightId):
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT seat_no FROM booking WHERE flight_id IS ?;", (flightId,))
    ret = [item for sublist in cur.fetchall() for item in sublist]
    return ret


def fetchTotalBooking():
    con = Database().con
    cur = con.cursor()
    cur.execute("SELECT COUNT(*) FROM booking;")
    ret = cur.fetchone()
    return ret[0]
