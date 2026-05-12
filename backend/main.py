import asyncio
import logging
from db import database
import logs
import uvicorn
from api import app

logs.setup_logging()

log = logging.getLogger(f"PearlHorizon.{__name__}")


async def main():
    database.init()
    log.info("Starting API Server")
    uviConfig = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=8000,
        loop="asyncio",
        log_level="info",
        log_config=None,
    )
    await uvicorn.Server(uviConfig).serve()


if __name__ == "__main__":
    asyncio.run(main())
