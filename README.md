# ELRICS Patient Management Portal

Full-stack patient management assessment: the original HTML/CSS/vanilla JavaScript frontend is retained and integrated with a Django REST Framework API.

## Stack
- Frontend: HTML5, CSS3, vanilla JavaScript ES modules (no Node/npm required)
- Backend: Python, Django, Django REST Framework
- Database: SQLite for a zero-configuration local assessment setup
- Authentication: JWT access/refresh tokens via Simple JWT

## Features
- Initial administrator registration (public registration closes after the first account is created)
- JWT login and protected patient endpoints
- Patient list, search by ID/name/phone/email, create, edit, view-ready detail API, and delete
- Server-side validation and useful API error messages
- CORS configuration for local frontend development

## Requirements
- Python 3.10+
- A modern browser

## Run locally
Open two terminals from the repository root.

### 1. Backend
```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env  # Windows; on macOS/Linux use: cp .env.example .env
python manage.py makemigrations patients
python manage.py migrate
python manage.py runserver 8000
```

The API will be available at `http://127.0.0.1:8000/api/`.

### 2. Frontend
From the repository root, serve the static files. For example:
```bash
python -m http.server 5500
```
Open `http://127.0.0.1:5500/login.html`. You can also use VS Code Live Server. The default API URL is `http://127.0.0.1:8000/api`; to override it, set `window.ELRICS_API_URL` before `js/app.js` loads.

### 3. First use
1. Open `register.html` and create the first administrator.
2. Log in through `login.html`.
3. Use Patients to create and manage records.

## API endpoints
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register/` | Public, first account only | Create initial admin |
| POST | `/api/auth/login/` | Public | Get JWT access/refresh tokens |
| POST | `/api/auth/refresh/` | Refresh token | Refresh access token |
| GET | `/api/auth/me/` | Authenticated admin | Current account |
| GET, POST | `/api/patients/` | Authenticated admin | List/search or create |
| GET, PATCH, PUT, DELETE | `/api/patients/<id>/` | Authenticated admin | Read/update/delete |

Send `Authorization: Bearer <access_token>` for protected endpoints. Search example: `/api/patients/?search=smith`.

## Data model and assumptions
- Each patient has name, age, gender, phone, optional email/address/emergency contact, blood group, status, and timestamps.
- SQLite is chosen for a fast local assessment. Django migrations create the schema; switch the database settings for a production deployment.
- Public registration is intentionally restricted to the first administrator to prevent anonymous users from creating privileged accounts. Additional account provisioning should be performed by a trusted administrator.
- Access tokens expire after 30 minutes; refresh tokens expire after one day.
- This is an assessment implementation, not a production-certified system for real patient/PHI data. Production use requires HTTPS, secret management, audit logs, backups, stricter operational controls, and a privacy/security review.

## Troubleshooting
- If the browser reports a CORS error, open the frontend from `localhost`/`127.0.0.1` and add its exact origin to `CORS_ALLOWED_ORIGINS` in `backend/.env`.
- If API requests fail to connect, make sure Django is running on port 8000.
- If you need to reset the local assessment database, stop Django and remove `backend/db.sqlite3`, then rerun migrations. This deletes all local accounts and patient records.
