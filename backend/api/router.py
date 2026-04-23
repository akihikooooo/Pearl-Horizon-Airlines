from fastapi.routing import APIRouter

from .search import router as searchRouter

api_router = APIRouter()

api_router.include_router(searchRouter, prefix="/search", tags=["search"])
