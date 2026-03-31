import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv

load_dotenv()

SECRET = os.getenv("JWT_SECRET", "changeme")
print(f"JWT SECRET LOADED: {SECRET}")
ALGORITHM = "HS256"
bearer_scheme = HTTPBearer()

def create_token(payload: dict, expires_in_hours: int = 8) -> str:
    data = payload.copy()
    data["exp"] = datetime.now(timezone.utc) + timedelta(hours=expires_in_hours)
    return jwt.encode(data, SECRET, algorithm=ALGORITHM)

def _decode(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        print("TOKEN ERROR: Expired")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:
        print(f"TOKEN ERROR: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Admin dependency ─────────────────────────────
def require_admin(
    creds: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)]
) -> dict:
    payload = _decode(creds.credentials)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload

# ── Verified voter dependency ────────────────────
def require_voter(
    creds: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)]
) -> dict:
    payload = _decode(creds.credentials)
    if payload.get("role") != "voter":
        raise HTTPException(status_code=403, detail="Voter access required")
    return payload
