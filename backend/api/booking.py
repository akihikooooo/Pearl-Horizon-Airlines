import sqlite3
import logging
from typing import Annotated, List, Optional
import uuid
from db.booking import bookPassengers, getTakenSeats, BookEntryParams
from db.review import addReview
from auth import verify_token
from fastapi import Depends, Query
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from pydantic import BaseModel, Field
from fastapi import Form, UploadFile, File, HTTPException
import os
log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()
RECEIPTS_DIR = "./receipts"
os.makedirs(RECEIPTS_DIR, exist_ok=True)
ALLOWED_RECEIPT_TYPES = {"image/jpeg", "image/png", "image/webp"}
class AvailableSeatParams(BaseModel):
    flight_id: str = Field(pattern=r"PH[0-9]{4}")


@router.get("/seats")
def get_available_seats(
    payload: Annotated[AvailableSeatParams, Query()],
    token: dict = Depends(verify_token),
):
    ret = getTakenSeats(payload.flight_id)
    return JSONResponse(content={"taken_seats": ret})



class CreditCardDetails(BaseModel):
    cardholder_name: str = Field(min_length=1)
    card_number: str = Field(pattern=r"^\d{16}$")
    expiry_month: int = Field(ge=1, le=12)
    expiry_year: int = Field(ge=2025)
    cvv: str = Field(pattern=r"^\d{3,4}$")



@router.post("/entry")
async def book_passengers(
    payload: str = Form(...),
    payment_mode: str = Form(...),
    card_details: Optional[str] = Form(None),
    receipt: Optional[UploadFile] = File(None),
    token: dict = Depends(verify_token),
):
    try:
        book_payload = BookEntryParams.model_validate_json(payload)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid payload: {e}")

    if payment_mode not in ("credit_card", "receipt"):
        raise HTTPException(status_code=422, detail="payment_mode must be 'credit_card' or 'receipt'")

    card_number = None
    receipt_path = None

    try:
        if payment_mode == "credit_card":
            if not card_details:
                raise HTTPException(status_code=422, detail="card_details is required for credit_card payment")
            try:
                card = CreditCardDetails.model_validate_json(card_details)
            except Exception as e:
                raise HTTPException(status_code=422, detail=f"Invalid card_details: {e}")
            card_number = card.card_number

        elif payment_mode == "receipt":
            if not receipt:
                raise HTTPException(status_code=422, detail="receipt file is required for receipt payment")
            if receipt.content_type not in ALLOWED_RECEIPT_TYPES:
                raise HTTPException(status_code=422, detail="Receipt must be an image (jpeg/png/webp)")

            ext = receipt.filename.rsplit(".", 1)[-1] if "." in receipt.filename else "jpg"
            receipt_filename = f"{uuid.uuid4()}.{ext}"
            receipt_path = os.path.join(RECEIPTS_DIR, receipt_filename)

            contents = await receipt.read()
            with open(receipt_path, "wb") as f:
                f.write(contents)

        bookPassengers(book_payload, token["user_id"], payment_mode, card_number, receipt_path)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Booking failed: {e}")

    if payment_mode == "credit_card":
        return {"success": True, "payment_mode": "credit_card", "last_four_digits": card_number[-4:]}
    else:
        return {"success": True, "payment_mode": "receipt"}

class FeedbackPayload(BaseModel):
    rating: int = Field(ge=1, le=5)
    comments: Optional[str] = Field(max_length=500)

@router.post("/feedback")
async def feedback(payload: FeedbackPayload, _token: dict = Depends(verify_token)):
    try:
        addReview(payload)
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback. Contact the administrator.")
    return {"success": True, "message": "Feedback submitted successfully."}