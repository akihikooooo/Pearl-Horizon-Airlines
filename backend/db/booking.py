from .database import Database
import uuid
from pydantic import BaseModel, Field
from time import time
from typing import List, Optional
from fastapi import Form
import base64

class PaymentDetailsModel(BaseModel):
    mode: str
    last_four_digits: Optional[str] = None
    receipt_image: Optional[str] = None  # base64 data URI for receipt mode

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
    payment: Optional[PaymentDetailsModel] = None
class BookEntryParams(BaseModel):
    flight_id: str
    amount_due: float
    passengers: List[PassengerParams]

def bookPassengers(payload: BookEntryParams, userId: str, payment_mode: str, card_number: Optional[str], receipt_path: Optional[str]):
    con = Database().con
    cur = con.cursor()
    cur.executemany(
        """
        INSERT INTO booking (
            title, first_name, last_name, gender, date_of_birth,
            email, phone_number, emergency_contact_name, emergency_phone_number,
            meal_preference, booking_id, user_id, flight_id, seat_no,
            amount_due, paid, payment_mode, card_number, receipt_path
        )
        VALUES (
            :title, :first_name, :last_name, :gender, :date_of_birth,
            :email, :phone_number, :emergency_contact_name, :emergency_phone_number,
            :meal_preference, :booking_id, :user_id, :flight_id, :selected_seat,
            :amount_due, :paid, :payment_mode, :card_number, :receipt_path
        )
        """,
        [
            {
                **p.model_dump(),
                "booking_id": str(uuid.uuid4()),
                "user_id": userId,
                "flight_id": payload.flight_id,
                "amount_due": payload.amount_due,
                "paid": 0,
                "payment_mode": payment_mode,
                "card_number": card_number,
                "receipt_path": receipt_path,
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
               flight.origin_airport_id, flight.destination_airport_id, flight.flight_time, flight.departure_timestamp,
               booking.payment_mode, booking.card_number, booking.receipt_path
        FROM booking
        LEFT JOIN flight ON booking.flight_id = flight.flight_id
        WHERE booking.user_id = ? AND flight.departure_timestamp > ?
        ORDER BY flight.departure_timestamp ASC
        """,
        (user_id, time()),
    )

    response = []
    for booking in cur.fetchall():
        (
            booking_id, flight_id, seat_no, title, first_name, last_name,
            origin_airport_id, destination_airport_id, flight_time, departure_timestamp,
            payment_mode, card_number, receipt_path,
        ) = booking

        payment = None
        if payment_mode == "credit_card":
            payment = PaymentDetailsModel(
                mode="credit_card",
                last_four_digits=card_number[-4:] if card_number else None,
            )
        elif payment_mode == "receipt":
            receipt_image = None
            if receipt_path:
                try:
                    with open(receipt_path, "rb") as f:
                        encoded = base64.b64encode(f.read()).decode("utf-8")
                    ext = receipt_path.rsplit(".", 1)[-1].lower()
                    mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext, "image/jpeg")
                    receipt_image = f"data:{mime};base64,{encoded}"
                except FileNotFoundError:
                    pass
            payment = PaymentDetailsModel(mode="receipt", receipt_image=receipt_image)

        response.append(
            bookedFlightModel(
                booking_id=booking_id,
                flight_id=flight_id,
                seat_no=seat_no,
                title=title,
                first_name=first_name,
                last_name=last_name,
                origin_airport_id=origin_airport_id,
                destination_airport_id=destination_airport_id,
                flight_time=flight_time,
                departure_timestamp=departure_timestamp,
                payment=payment,
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

class PaymentDetailsResponse(BaseModel):
    booking_id: str
    user_id: str
    payment_mode: str
    # credit card fields
    last_four_digits: Optional[str] = None
    # receipt fields
    receipt_image: Optional[str] = None  # base64 data URI


def fetchPaymentByBookingId(booking_id: str):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        """
        SELECT booking_id, user_id, payment_mode, card_number, receipt_path
        FROM booking
        WHERE booking_id IS ?
        """,
        (booking_id,),
    )
    row = cur.fetchone()
    if not row:
        return None

    booking_id, user_id, payment_mode, card_number, receipt_path = row

    if payment_mode == "credit_card":
        return PaymentDetailsResponse(
            booking_id=booking_id,
            user_id=user_id,
            payment_mode=payment_mode,
            last_four_digits=card_number[-4:] if card_number else None,
        )

    elif payment_mode == "receipt":
        receipt_image = None
        if receipt_path:
            try:
                with open(receipt_path, "rb") as f:
                    encoded = base64.b64encode(f.read()).decode("utf-8")
                ext = receipt_path.rsplit(".", 1)[-1].lower()
                mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext, "image/jpeg")
                receipt_image = f"data:{mime};base64,{encoded}"
            except FileNotFoundError:
                pass
        return PaymentDetailsResponse(
            booking_id=booking_id,
            user_id=user_id,
            payment_mode=payment_mode,
            receipt_image=receipt_image,
        )

    return None


def updatePaidStatus(booking_id: str, paid: int):
    con = Database().con
    cur = con.cursor()
    cur.execute(
        "UPDATE booking SET paid = ? WHERE booking_id = ?",
        (paid, booking_id),
    )
    if cur.rowcount == 0:
        return False
    con.commit()
    return True