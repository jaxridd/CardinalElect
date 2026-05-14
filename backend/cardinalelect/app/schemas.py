from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional

# ── Auth ─────────────────────────────────────────
class AdminLogin(BaseModel):
    username: str
    password: str

# ── Elections ────────────────────────────────────
class ElectionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime

    @field_validator("end_time")
    @classmethod
    def end_after_start(cls, end, info):
        if "start_time" in info.data and end <= info.data["start_time"]:
            raise ValueError("end_time must be after start_time")
        return end

# ── Positions ────────────────────────────────────
class PositionCreate(BaseModel):
    title: str
    description: Optional[str] = None

# ── Candidates ───────────────────────────────────
class CandidateCreate(BaseModel):
    name: str
    photo_url: Optional[str] = None
    description: Optional[str] = None

# ── Voter Verification ───────────────────────────
class VerifyRequest(BaseModel):
    full_name: str
    department: str
    l_number: str
    email: EmailStr

    @field_validator("email")
    @classmethod
    def must_be_lamar_email(cls, v):
        if not v.lower().endswith("@lamar.edu"):
            raise ValueError("Must use a valid Lamar University email (@lamar.edu)")
        return v

class VerifyConfirm(BaseModel):
    email: EmailStr
    code: str

# ── Votes ────────────────────────────────────────
class VoteCast(BaseModel):
    election_id: int
    position_id: int
    candidate_id: int
