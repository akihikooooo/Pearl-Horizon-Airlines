import logging

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

log = logging.getLogger(f"PearlHorizon.{__name__}")

router = APIRouter()


@router.get("/flights")
async def get_all_channels():
    results = {"test": "not implemented"}
    return JSONResponse(
        content=results,
        status_code=status.HTTP_200_OK,
    )
