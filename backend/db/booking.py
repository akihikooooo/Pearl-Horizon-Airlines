from .database import Database
import uuid


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
