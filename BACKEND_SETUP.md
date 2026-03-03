# Backend Setup Guide

This project supports **two backend options**: Django (Python) and Express (Node.js).

## Option 1: Django Backend (Python) - DEFAULT

The Django backend provides full authentication with JWT tokens and is the recommended backend.

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setup Instructions

1. **Navigate to Django backend directory:**
   ```bash
   cd python/django_backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r ../../requirements.txt
   # OR use the setup script:
   # bash ../setup.sh
   ```

3. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create a superuser (admin) - OPTIONAL:**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create admin credentials.

5. **Start the Django development server:**
   ```bash
   python manage.py runserver 8000
   ```

   The Django backend will be available at: `http://127.0.0.1:8000`

### Django API Endpoints

- **Authentication:**
  - `POST /api/auth/login/` - User login
  - `POST /api/auth/register/` - User registration
  - `POST /api/auth/token/refresh/` - Refresh JWT token
  - `GET /api/auth/me/` - Get current user info

- **Admin Panel:**
  - `http://127.0.0.1:8000/admin/` - Django admin interface

- **Health Check:**
  - `GET /api/health/` - Check if server is running

### Testing the Backend

```bash
# Test login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"test123"}'

# Test health check
curl http://127.0.0.1:8000/api/health/
```

---

## Option 2: Express Backend (Node.js)

The Express backend is integrated with the Vite dev server.

### Setup Instructions

1. **Start the development server:**
   ```bash
   pnpm dev
   ```

   The Express backend will be available at: `http://localhost:8080/api/`

### Express API Endpoints

- `POST /api/auth/login/` - User login (auto-creates users for demo)
- `POST /api/auth/register/` - User registration
- `POST /api/auth/token/refresh/` - Refresh token
- `GET /api/ping` - Health check

---

## Switching Between Backends

### Using Django Backend (Recommended)

1. Make sure `.env` file has:
   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

2. Start Django backend:
   ```bash
   cd python/django_backend
   python manage.py runserver 8000
   ```

3. In another terminal, start frontend:
   ```bash
   pnpm dev
   ```

### Using Express Backend

1. Update `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

2. Start the combined server:
   ```bash
   pnpm dev
   ```

---

## Running Both Frontend and Backend

### Full Setup (Django Backend)

**Terminal 1 - Django Backend:**
```bash
cd python/django_backend
python manage.py runserver 8000
```

**Terminal 2 - React Frontend:**
```bash
pnpm dev
```

**Access the application:**
- Frontend: http://localhost:8080
- Backend API: http://127.0.0.1:8000/api/
- Admin Panel: http://127.0.0.1:8000/admin/

---

## Troubleshooting

### "Unable to connect to server" Error

1. **Check if Django backend is running:**
   ```bash
   curl http://127.0.0.1:8000/api/health/
   ```

2. **Verify .env configuration:**
   - Check that `VITE_API_BASE_URL=http://127.0.0.1:8000`

3. **Check CORS settings:**
   - Django settings.py already includes localhost:8080 in CORS_ALLOWED_ORIGINS

4. **Restart both servers:**
   - Stop Django: `Ctrl+C` in Django terminal
   - Stop frontend: `Ctrl+C` in frontend terminal
   - Start Django again: `python manage.py runserver 8000`
   - Start frontend again: `pnpm dev`

### Database Issues

```bash
# Reset database (development only)
cd python/django_backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Port Already in Use

```bash
# Django (port 8000)
python manage.py runserver 8001  # Use different port

# Update .env:
VITE_API_BASE_URL=http://127.0.0.1:8001
```

### Check Server Logs

- **Django:** Logs appear in the terminal where you ran `python manage.py runserver`
- **Frontend:** Check browser console (F12)

---

## Default Test Users

When using Express backend, users are auto-created on first login.

For Django backend, register a new user or create via admin panel.

### Create Test User via Django Shell:

```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='password123',
    first_name='Test',
    last_name='User'
)
print(f"Created user: {user.email}")
```

---

## Production Deployment

For production:

1. Use PostgreSQL instead of SQLite
2. Set proper SECRET_KEY in environment
3. Disable DEBUG mode
4. Configure proper ALLOWED_HOSTS
5. Use HTTPS
6. Set up proper CORS origins
