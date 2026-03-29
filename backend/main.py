from fastapi import FastAPI
from fastapi.routing import APIRouter
import uvicorn
import asyncio
from api.search import router as search_router


async def main():
    app = FastAPI()
    router = APIRouter()

    router.include_router(search_router, prefix="/search", tags=["search"])
    app.include_router(router=router, prefix="/api")

    uviConfig = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=8000,
        loop="asyncio",
        log_level="info",
    )
    server = uvicorn.Server(uviConfig)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(main())
