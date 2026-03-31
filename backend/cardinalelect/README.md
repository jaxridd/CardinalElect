# CardinalElect
### Lamar University Online Voting System

CardinalElect is a web-based voting system designed for Lamar University students. It allows election administrators to create elections, define positions, upload candidate information, and view real-time voting results. Students can verify their identity using their Lamar University email and cast votes securely.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Running the Server](#running-the-server)
6. [Testing the API](#testing-the-api)
7. [API Endpoints](#api-endpoints)
8. [Student Voting Flow](#student-voting-flow)
9. [Admin Flow](#admin-flow)
10. [Environment Variables](#environment-variables)
11. [Project Structure](#project-structure)
12. [Team](#team)

---

## Features

- Admin can create elections with start and end times
- Admin can define positions (e.g. Student Body President)
- Admin can add candidates with name, photo, and description
- Students verify identity using their `@lamar.edu` email
- 6-digit verification code expires after 10 minutes
- Verified students can view candidates and cast votes
- System prevents duplicate voting per position
- Voting automatically closes at the election end time
- Admin real-time dashboard shows live vote counts
- Final results displayed after voting closes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.11 |
| Web Framework | FastAPI |
| Database | PostgreSQL 18 |
| DB Driver | asyncpg |
| Authentication | PyJWT + bcrypt |
| Data Validation | Pydantic v2 |
| Server | Uvicorn |
| Email | SMTP via smtplib |

---

## Prerequisites

Before running this project make sure you have:

- **Python 3.11** — [python.org/downloads/release/python-3119](https://www.python.org/downloads/release/python-3119/)
- **PostgreSQL 18** — [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
- **Visual Studio Code** (recommended) with the Python extension

---

## Installation & Setup

**Step 1 — Clone or download the project**

Place the `cardinalelect` folder on your desktop or preferred location.

**Step 2 — Open in VS Code**

```
File → Open Folder → select the cardinalelect folder
```

**Step 3 — Open the terminal**

Press `` Ctrl+` `` to open the built-in terminal.

**Step 4 — Create a virtual environment**

```bash
python -m venv venv
```

**Step 5 — Activate the virtual environment**

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal line.

**Step 6 — Install dependencies**

```bash
pip install -r requirements.txt
```

**Step 7 — Set up the environment file**

```bash
copy .env.example .env
```

Open `.env` and fill in your values:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/cardinalelect
JWT_SECRET=any_long_random_string_here
```

**Step 8 — Create the database**

```bash
psql -U postgres -c "CREATE DATABASE cardinalelect;"
```

**Step 9 — Run the database schema**

```bash
psql -U postgres -d cardinalelect -f schema.sql
```

You should see several `CREATE TABLE` and `CREATE INDEX` messages.

**Step 10 — Create the admin account**

Open `seed_admin.py` and set your desired password, then run:

```bash
python seed_admin.py
```

You should see:
```
Admin 'admin' created (or already exists).
```

---

## Running the Server

```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

> **Note:** Every time you reopen VS Code you must activate the virtual environment first with `venv\Scripts\activate` before running the server.

---

## Testing the API

Once the server is running, open your browser and go to:

```
http://localhost:8000/docs
```

This opens the **Swagger UI** — an interactive page where you can test every API endpoint without any extra tools.

**To log in as admin:**
1. Click `POST /api/auth/login`
2. Click **Try it out**
3. Enter your admin credentials and click **Execute**
4. Copy the token from the response (just the `eyJ...` part)
5. Click **Authorize** at the top right of the page
6. Paste the token and click **Authorize**

---

## API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login — returns JWT token |

### Elections
| Method | Path | Description |
|---|---|---|
| POST | `/api/elections/` | Create a new election (admin) |
| GET | `/api/elections/` | List all elections |
| GET | `/api/elections/{id}` | Get election with positions and candidates |
| POST | `/api/elections/{id}/positions` | Add a position (admin) |
| POST | `/api/elections/{id}/positions/{pos_id}/candidates` | Add a candidate (admin) |
| POST | `/api/elections/{id}/verify/request` | Request verification code (student) |
| POST | `/api/elections/{id}/verify/confirm` | Confirm verification code (student) |

### Votes
| Method | Path | Description |
|---|---|---|
| POST | `/api/votes/` | Cast a vote (verified student) |
| GET | `/api/votes/my-votes` | View your cast votes |

### Admin
| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/dashboard/{id}` | Real-time vote counts (admin) |
| GET | `/api/admin/results/{id}` | Final results after election closes |

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server health check |

---

## Student Voting Flow

1. Go to the election page and enter your name, L Number, department, and `@lamar.edu` email
2. Check your email inbox for a 6-digit verification code (expires in 10 minutes)
3. Enter the verification code to access the ballot
4. View the available positions and candidates
5. Cast your vote for one candidate per position
6. Receive confirmation that your vote was recorded
7. The system blocks any attempt to vote again for the same position

---

## Admin Flow

1. Log in with your admin credentials
2. Create a new election with a title, description, start time, and end time
3. Add positions to the election (e.g. Student Body President, VP of Finance)
4. Add candidates to each position with their name, photo URL, and description
5. Monitor the live dashboard during the election to see real-time vote counts
6. View the final results once the election end time has passed

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `SMTP_HOST` | SMTP server hostname for sending emails |
| `SMTP_PORT` | SMTP server port (usually 587) |
| `SMTP_USER` | SMTP username / email address |
| `SMTP_PASS` | SMTP password |

---

## Project Structure

```
cardinalelect/
├── app/
│   ├── __init__.py
│   ├── main.py              ← FastAPI entry point
│   ├── schemas.py           ← Pydantic request/response models
│   ├── db/
│   │   ├── __init__.py
│   │   └── pool.py          ← PostgreSQL connection pool
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py          ← JWT authentication middleware
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py          ← Admin login route
│   │   ├── elections.py     ← Election management + verification
│   │   ├── votes.py         ← Vote casting routes
│   │   └── admin.py         ← Dashboard and results routes
│   └── utils/
│       ├── __init__.py
│       └── email.py         ← Email verification utility
├── schema.sql               ← PostgreSQL database schema (DDL)
├── seed_admin.py            ← Script to create the first admin account
├── requirements.txt         ← Python dependencies
├── .env.example             ← Environment variables template
└── README.md                ← This file
```

---

## Team

| Name | Role | Contributions |
|---|---|---|
| Jax Riddell | Requirements Lead | Sections 1–5 of requirements document |
| Xavian Todd | System Modeling Support | Use case model and requirement traceability |
| Adam Nguyen | Documentation & Planning / Backend Developer | Project scheduling, risk analysis, backend implementation |

**Course:** CPSC 4360/5360 Software Engineering
**Instructor:** Dr. Islam — Department of Computer Science, Lamar University
**Semester:** Spring 2026
