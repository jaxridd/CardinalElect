"""
Run once to create your first admin account.
Usage: python seed_admin.py
"""
import asyncio
import os
import bcrypt
import asyncpg
from dotenv import load_dotenv

load_dotenv()

USERNAME = "admin"
PASSWORD = "admin123"

async def seed():
    conn = await asyncpg.connect(dsn=os.getenv("DATABASE_URL"))
    hashed = bcrypt.hashpw(PASSWORD.encode(), bcrypt.gensalt()).decode()
    await conn.execute(
        "INSERT INTO admins (username, password_hash) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        USERNAME, hashed,
    )
    await conn.close()
    print(f"Admin '{USERNAME}' created (or already exists).")

asyncio.run(seed())
