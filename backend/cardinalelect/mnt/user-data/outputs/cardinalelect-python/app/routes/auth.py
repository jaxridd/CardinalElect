import bcrypt
from fastapi import APIRouter, HTTPException

from app.db.pool import get_pool
from app.schemas import AdminLogin
from app.middleware.auth import create_token

router = APIRouter()

@router.post("/login")
async def login(body: AdminLogin):
    """Admin login. Returns a signed JWT."""
    pool = get_pool()
    row = await pool.fetchrow(
        "SELECT * FROM admins WHERE username = $1", body.username
    )
    if not row or not bcrypt.checkpw(body.password.encode(), row["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"role": "admin", "admin_id": row["admin_id"], "username": row["username"]})
    return {"token": token}
