from typing import Optional

import jwt
from fastapi import Cookie, HTTPException

SECRET_KEY = "putanginamotalaganatamadpakogumawangproperprovatekeyparadito<3"
ALGORITHM = "HS256"


def verify_token(token: Optional[str] = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
