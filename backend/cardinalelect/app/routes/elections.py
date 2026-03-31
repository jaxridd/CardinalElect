from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.db.pool import get_pool
from app.middleware.auth import require_admin, create_token
from app.schemas import CandidateCreate, ElectionCreate, PositionCreate, VerifyConfirm, VerifyRequest
from app.utils.email import generate_code, send_verification_email

router = APIRouter()

@router.post("/")
async def create_election(body: ElectionCreate, admin=Depends(require_admin)):
    pool = get_pool()
    row = await pool.fetchrow(
        """INSERT INTO elections (admin_id, title, description, start_time, end_time)
           VALUES ($1, $2, $3, $4, $5) RETURNING *""",
        admin["admin_id"], body.title, body.description, body.start_time, body.end_time,
    )
    return dict(row)

@router.get("/")
async def list_elections():
    pool = get_pool()
    rows = await pool.fetch("SELECT * FROM elections ORDER BY start_time DESC")
    return [dict(r) for r in rows]

@router.get("/{election_id}")
async def get_election(election_id: int):
    pool = get_pool()
    election = await pool.fetchrow(
        "SELECT * FROM elections WHERE election_id = $1", election_id
    )
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")

    positions = await pool.fetch(
        """SELECT p.position_id, p.title, p.description,
                  json_agg(json_build_object(
                      'candidate_id', c.candidate_id,
                      'name', c.name,
                      'photo_url', c.photo_url,
                      'description', c.description
                  ) ORDER BY c.candidate_id) AS candidates
           FROM positions p
           LEFT JOIN candidates c ON c.position_id = p.position_id
           WHERE p.election_id = $1
           GROUP BY p.position_id
           ORDER BY p.position_id""",
        election_id,
    )

    return {**dict(election), "positions": [dict(p) for p in positions]}

@router.post("/{election_id}/positions")
async def create_position(election_id: int, body: PositionCreate, admin=Depends(require_admin)):
    pool = get_pool()
    row = await pool.fetchrow(
        "INSERT INTO positions (election_id, title, description) VALUES ($1, $2, $3) RETURNING *",
        election_id, body.title, body.description,
    )
    return dict(row)

@router.post("/{election_id}/positions/{position_id}/candidates")
async def create_candidate(
    election_id: int, position_id: int, body: CandidateCreate, admin=Depends(require_admin)
):
    pool = get_pool()
    row = await pool.fetchrow(
        """INSERT INTO candidates (position_id, name, photo_url, description)
           VALUES ($1, $2, $3, $4) RETURNING *""",
        position_id, body.name, body.photo_url, body.description,
    )
    return dict(row)

@router.post("/{election_id}/verify/request")
async def request_verification(election_id: int, body: VerifyRequest):
    pool = get_pool()

    election = await pool.fetchrow(
        "SELECT * FROM elections WHERE election_id = $1", election_id
    )
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")

    code = generate_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    await pool.execute(
        """INSERT INTO voter_verifications
             (election_id, full_name, department, l_number, email, verification_code, code_expires_at, is_verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE)
           ON CONFLICT (election_id, email)
           DO UPDATE SET
             verification_code = EXCLUDED.verification_code,
             code_expires_at   = EXCLUDED.code_expires_at,
             is_verified       = FALSE""",
        election_id, body.full_name, body.department, body.l_number,
        body.email, code, expires_at,
    )

    send_verification_email(body.email, code)
    return {"message": "Verification code sent to your Lamar University email."}

@router.post("/{election_id}/verify/confirm")
async def confirm_verification(election_id: int, body: VerifyConfirm):
    pool = get_pool()

    record = await pool.fetchrow(
        "SELECT * FROM voter_verifications WHERE election_id = $1 AND email = $2",
        election_id, body.email,
    )
    if not record:
        raise HTTPException(status_code=404, detail="No verification request found for this email")

    if datetime.now(timezone.utc) > record["code_expires_at"].replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=400, detail="Verification code has expired. Please request a new one.")

    if record["verification_code"] != body.code:
        raise HTTPException(status_code=400, detail="Incorrect verification code. Please try again.")

    await pool.execute(
        "UPDATE voter_verifications SET is_verified = TRUE WHERE election_id = $1 AND email = $2",
        election_id, body.email,
    )

    token = create_token(
        {"role": "voter", "email": body.email, "election_id": election_id},
        expires_in_hours=48,
    )

    # Write token to file for easy copying
    with open("voter_token.txt", "w") as f:
        f.write(token)

    print(f"\n{'='*40}")
    print(f"VOTER TOKEN FOR: {body.email}")
    print(f"TOKEN: {token}")
    print(f"Paste into Authorize box (no Bearer needed)")
    print(f"{'='*40}\n")

    return {"message": "Identity verified. You may now vote.", "token": token}