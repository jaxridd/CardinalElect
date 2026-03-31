from datetime import datetime, timezone
from typing import Annotated

from asyncpg import UniqueViolationError
from fastapi import APIRouter, Depends, HTTPException

from app.db.pool import get_pool
from app.middleware.auth import require_voter
from app.schemas import VoteCast

router = APIRouter()

@router.post("/")
async def cast_vote(body: VoteCast, voter=Depends(require_voter)):
    print(f"VOTER DATA: {voter}")
    pool = get_pool()

    if voter["election_id"] != body.election_id:
        raise HTTPException(status_code=403, detail="Token is not valid for this election")

    election = await pool.fetchrow(
        "SELECT * FROM elections WHERE election_id = $1", body.election_id
    )
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")

    now = datetime.now(timezone.utc)
    if now < election["start_time"].replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=400, detail="Election has not started yet")
    if now > election["end_time"].replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=400, detail="Election has closed.")

    candidate = await pool.fetchrow(
        "SELECT * FROM candidates WHERE candidate_id = $1 AND position_id = $2",
        body.candidate_id, body.position_id,
    )
    if not candidate:
        raise HTTPException(status_code=400, detail="Candidate does not belong to the specified position")

    try:
        row = await pool.fetchrow(
            """INSERT INTO votes (election_id, position_id, candidate_id, voter_email)
               VALUES ($1, $2, $3, $4) RETURNING vote_id, voted_at""",
            body.election_id, body.position_id, body.candidate_id, voter["email"],
        )
        return {
            "message": "Your vote has been recorded.",
            "vote_id": row["vote_id"],
            "voted_at": row["voted_at"],
        }
    except UniqueViolationError:
        raise HTTPException(status_code=409, detail="You have already voted for this position.")

@router.get("/my-votes")
async def my_votes(election_id: int, voter=Depends(require_voter)):
    pool = get_pool()
    rows = await pool.fetch(
        """SELECT v.vote_id, v.position_id, p.title AS position_title,
                  v.candidate_id, c.name AS candidate_name, v.voted_at
           FROM votes v
           JOIN positions p ON p.position_id = v.position_id
           JOIN candidates c ON c.candidate_id = v.candidate_id
           WHERE v.election_id = $1 AND v.voter_email = $2
           ORDER BY v.voted_at""",
        election_id, voter["email"],
    )
    return [dict(r) for r in rows]

""" @router.post("/test-vote")
async def test_vote(body: VoteCast):
    # Temporary test route - no auth required
    pool = get_pool()
    try:
        row = await pool.fetchrow(
            # INSERT INTO votes (election_id, position_id, candidate_id, voter_email)
               # VALUES ($1, $2, $3, $4) RETURNING vote_id, voted_at,
            body.election_id, body.position_id, body.candidate_id, "test@lamar.edu",
        )
        return {
            "message": "Vote recorded!",
            "vote_id": row["vote_id"],
            "voted_at": row["voted_at"],
        }
    except Exception as e:
        return {"error": str(e)} """

"""@router.post("/verify-token")
async def verify_token(data: dict):
    # Temporary - tests if a token is valid
    from app.middleware.auth import _decode
    try:
        payload = _decode(data["token"])
        return {"valid": True, "payload": payload}
    except Exception as e:
        return {"valid": False, "error": str(e)}"""