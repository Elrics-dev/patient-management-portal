# ELRICS Patient Management Portal — Backend

## 1. Project Overview

The ELRICS Patient Management Portal is a healthcare management application built with Django and Django REST Framework. It provides APIs for administrator authentication and patient record management.

The backend is designed to integrate with the existing HTML, CSS, and vanilla JavaScript frontend without changing its overall UI/UX.

### Features

- Administrator registration and login
- JWT-based authentication
- Patient registration and record retrieval
- Patient information updates and deletion
- Patient search
- Server-side input validation
- Persistent database storage
- Django database migrations
- CORS configuration for frontend integration

## 2. Technology Stack

- Python
- Django 5.2
- Django REST Framework
- Simple JWT
- django-cors-headers
- python-dotenv
- SQLite for local development

## 3. Prerequisites

Install the following before running the backend:

- Python 3.10 or newer, compatible with the dependencies
- pip
- A terminal such as PowerShell
- Git (optional, for version control)

## 4. Installation

Open PowerShell and navigate to the backend directory:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```powershell
pip install -r requirements.txt
```

If PowerShell blocks virtual environment activation, consult the Python documentation for the appropriate execution policy. Alternatively, run the environment's Python executable directly.

## 5. Environment Configuration

Create your local environment file:

```powershell
Copy-Item .env.example .env
```

Review `.env.example` and update `.env` with appropriate local development settings.

Do not commit `.env` or put production secrets in source control. Use a strong, private secret key and `DEBUG=False` in production.

The exact supported environment variables are defined in `config/settings.py` and `.env.example`.

## 6. Database Setup

Apply database migrations:

```powershell
python manage.py migrate
```

Check migration status:

```powershell
python manage.py showmigrations
```

Check whether model changes require new migrations:

```powershell
python manage.py makemigrations --check --dry-run
```

If model changes have not yet been migrated, create and review the required migration files before applying them.

SQLite is used for local development. The database file is normally created automatically when migrations are applied.

## 7. Run the Backend

Start the Django development server:

```powershell
python manage.py runserver
```

The backend will normally be available at:

http://127.0.0.1:8000/

Keep this terminal open while using the frontend.

The Django development server is intended for local development, not production deployment.

## 8. Run the Frontend

Open a second terminal from the project root, where the HTML files are located:

```powershell
python -m http.server 5500
```

Open the registration page:

http://127.0.0.1:5500/register.html

Register the initial administrator, log in, and test the dashboard and patient management features.

The frontend API base URL and allowed CORS origins must match your local development configuration.

## 9. API Documentation

The API is implemented using Django REST Framework. Confirm the exact endpoint paths and request fields in the project's URL configuration, views, serializers, and frontend API service.

Expected API operations include:

| Operation | Purpose |
|---|---|
| Administrator registration | Create an initial administrator account |
| Login | Authenticate an administrator and obtain tokens |
| Token refresh | Obtain a new access token if configured |
| List patients | Retrieve patient records |
| Create patient | Register a patient |
| Retrieve patient | View an individual patient record |
| Update patient | Modify patient details |
| Delete patient | Remove a patient record |
| Search patients | Find matching patient records |

Patient endpoints should require valid authentication. Send the access token using the Bearer authorization scheme when required by the API.

Example HTTP header:

```http
Authorization: Bearer <access_token>
```

For exact paths, HTTP methods, request formats, and response schemas, refer to the project's URL and serializer definitions.

## 10. Authentication and Security

- Passwords should be stored using Django's password hashing mechanisms.
- Protected API endpoints should reject unauthenticated requests.
- Patient input must be validated on the server.
- Secrets must be stored outside version control.
- CORS should allow only the required frontend origins.
- Production deployments must use HTTPS, secure configuration, and an appropriate production server.
- Patient data should be handled confidentially and access should be restricted to authorized users.

## 11. Git and Migrations

Migration files are part of the source code and should be committed to Git.

Do not commit the virtual environment, local secrets, or generated Python cache files.

Useful commands:

```powershell
git status
git add .
git commit -m "Document ELRICS backend setup"
```

## 12. Assumptions and Limitations

- SQLite is the default local development database.
- The supplied frontend remains HTML, CSS, and vanilla JavaScript.
- The backend runs independently from the frontend.
- The initial administrator must be created before login.
- The API's exact field requirements and endpoint paths are determined by the implementation.
- This project is an assessment implementation and must be reviewed and tested before production use.

## 13. Troubleshooting

### Dependency installation fails

Confirm that the virtual environment is activated and that `requirements.txt` exists.

### Database errors

Run:

```powershell
python manage.py migrate
```

### Login returns HTTP 401

Verify the registered username and password, and inspect the login request payload in the browser's Network panel.

### Registration returns HTTP 400

Inspect the response body to identify field validation errors or duplicate account details.

### CORS errors

Check that the frontend origin is allowed in the Django CORS configuration and that the API base URL is correct.

### Port already in use

Run the development server on another available port, for example:

```powershell
python manage.py runserver 8001
```

Update the frontend API configuration if you change the backend port.
