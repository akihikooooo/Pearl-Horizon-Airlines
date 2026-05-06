from fastapi.routing import APIRouter

from .auth import app as authRouter
from .booking import router as bookingRouter
from .search import router as searchRouter

api_router = APIRouter()

api_router.include_router(searchRouter, prefix="/search", tags=["search"])
api_router.include_router(authRouter, prefix="/auth", tags=["auth"])
api_router.include_router(bookingRouter, prefix="/book", tags=["booking"])
