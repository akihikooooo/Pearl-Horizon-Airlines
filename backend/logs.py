import logging
import logging.config

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "console": {
            "format": "[{asctime}] [{levelname:<8}] {name:<16}: {message}",
            "datefmt": "%Y-%m-%d %H:%M:%S",
            "style": "{",
        },
    },
    "handlers": {
        "console_info": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "console",
        },
        "console_error": {
            "class": "logging.StreamHandler",
            "level": "ERROR",
            "formatter": "console",
        },
    },
    "loggers": {
        "uvicorn": {
            "handlers": ["console_info"],
            "level": "INFO",
            "propagate": True,
        },
        "uvicorn.error": {
            "handlers": ["console_error"],
            "level": "ERROR",
            "propagate": True,
        },
        "uvicorn.access": {
            "handlers": ["console_info"],
            "level": "INFO",
            "propagate": False,
        },
        "PearlHorizon": {
            "handlers": ["console_info"],
            "level": "DEBUG",
            "propagate": True,
        },
    },
    "root": {
        "level": "WARNING",
        "handlers": ["console_error"],
    },
}


def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)
    log = logging.getLogger(f"PearlHorizon.{__name__}")
    log.debug("Logger has been set up.")
