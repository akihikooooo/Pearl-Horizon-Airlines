import logging 
import uvicorn
import asyncio
from api import app
import db
import logs
logs.setup_logging()

log = logging.getLogger(f"PearlHorizon.{__name__}")

async def main():
    db.init()
    log.info("Starting API Server")
    uviConfig = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=8000,
        loop="asyncio",
        log_level="info",
        log_config=None
    )
    await uvicorn.Server(uviConfig).serve()
    

if __name__ == "__main__":
    asyncio.run(main())