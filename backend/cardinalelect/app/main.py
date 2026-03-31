from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.pool import init_db, close_db
from app.routes import auth, elections, votes, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(title="CardinalElect API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(elections.router, prefix="/api/elections",  tags=["Elections"])
app.include_router(votes.router,     prefix="/api/votes",      tags=["Votes"])
app.include_router(admin.router,     prefix="/api/admin",      tags=["Admin"])

@app.get("/api/health")
async def health():
    return {"status": "ok"}