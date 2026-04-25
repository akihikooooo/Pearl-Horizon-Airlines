from fastapi.routing import APIRouter

from .search import router as searchRouter
from .auth import app as authRouter
api_router = APIRouter()

api_router.include_router(searchRouter, prefix="/search", tags=["search"])
api_router.include_router(authRouter, prefix="/auth", tags=["auth"])