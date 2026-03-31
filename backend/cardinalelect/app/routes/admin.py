from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.db.pool import get_pool
from app.middleware.auth import require_admin

router = APIRouter()

def _group_by_position(rows):
    positions = {}
    for r in rows:
        pid = r["position_id"]
        if pid not in positions:
            positions[pid] = {
                "position_id": pid,
                "position_title": r["position_title"],
                "candidates": [],
            }
        positions[pid]["candidates"].append({
            "candidate_id": r["candidate_id"],
            "candidate_name": r["candidate_name"],
            "photo_url": r["photo_url"],
            "vote_count": r["vote_count"],
        })
    return list(positions.values())

RESULTS_QUERY = """
    SELECT p.position_id, p.title AS position_title,
           c.candidate_id, c.name AS candidate_name, c.photo_url,
           COUNT(v.vote_id)::INT AS vote_count
    FROM positions p
    JOIN candidates c ON c.position_id = p.position_id
    LEFT JOIN votes v ON v.candidate_id = c.candidate_id AND v.election_id = $1
    WHERE p.election_id = $1
    GROUP BY p.position_id, p.title, c.candidate_id, c.name, c.photo_url
    ORDER BY p.position_id, vote_count DESC
"""

@router.get("/dashboard/{election_id}")
async def dashboard(election_id: int, admin=Depends(require_admin)):
    """
    FR-17: Real-time admin dashboard.
    FR-18: Live vote counts per candidate per position.
    """
    pool = get_pool()
    election = await pool.fetchrow(
        "SELECT * FROM elections WHERE election_id = $1", election_id
    )
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")

    now = datetime.now(timezone.utc)
    start = election["start_time"].replace(tzinfo=timezone.utc)
    end = election["end_time"].replace(tzinfo=timezone.utc)

    rows = await pool.fetch(RESULTS_QUERY, election_id)
    total = await pool.fetchval(
        "SELECT COUNT(*)::INT FROM votes WHERE election_id = $1", election_id
    )
    verified = await pool.fetchval(
        "SELECT COUNT(*)::INT FROM voter_verifications WHERE election_id = $1 AND is_verified = TRUE",
        election_id,
    )

    return {
        "election": dict(election),
        "is_open": start <= now <= end,
        "is_closed": now > end,
        "total_votes_cast": total,
        "verified_voters": verified,
        "positions": _group_by_position(rows),
    }

@router.get("/results/{election_id}")
async def final_results(election_id: int):
    """
    FR-16: Public final results — only visible after the election closes.
    """
    pool = get_pool()
    election = await pool.fetchrow(
        "SELECT * FROM elections WHERE election_id = $1", election_id
    )
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")

    if datetime.now(timezone.utc) <= election["end_time"].replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=403, detail="Results will be available once voting closes.")

    rows = await pool.fetch(RESULTS_QUERY, election_id)
    return {"election": dict(election), "positions": _group_by_position(rows)}
