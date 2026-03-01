# Django DRF Backend Migration Guide

## Overview

Your Django REST Framework backend is scaffolded at `python/django_backend/` and mirrors the existing Flask API contract exactly.

---

## Current API Endpoints (Flask → Django DRF Equivalent)

| Flask Route                  | DRF Route                    | Compatibility |
|-----------------------------|------------------------------|---------------|
| `/api/properties`           | `/api/properties/`           | ✅ GET/POST/PUT/DELETE |
| `/api/tenants`              | `/api/tenants/`              | ✅ GET/POST/PUT/DELETE |
| `/api/payments`             | `/api/payments/`             | ✅ GET/POST/PUT/DELETE |
| `/api/invoices`             | `/api/invoices/`             | ✅ GET/POST/PUT/DELETE |
| `/api/stats/properties`     | `/api/stats/properties/`     | ✅ GET |
| `/api/stats/payments`       | `/api/payments/stats/`       | ✅ GET |
| `/api/stats/revenue-trends` | `/api/stats/revenue-trends/` | ✅ GET |
| `/api/stats/dashboard`      | `/api/stats/dashboard/`      | ✅ GET |
| `/api/health`               | `/api/health/`               | ✅ GET |
| `/api/ping`                 | `/api/ping/`                 | ✅ GET |
| `/api/demo`                 | `/api/demo/`                 | ✅ GET |

### JWT Authentication (NEW)

- `POST /api/auth/token/` - Obtain access & refresh tokens
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user profile (requires auth)

---

## Response Format Compatibility

**Flask response:**
```json
{
  "success": true,
  "data": [...]
}
```

**DRF response (direct array):**
```json
[...]
```

**Frontend adaptation needed:** Change from `data.data` to `data` when parsing responses if switching.

**Alternative:** Add a custom renderer in DRF to wrap responses with `{success: true, data: ...}` for perfect backward compatibility.

---

## Migration Steps

### 1. Install Dependencies

```bash
cd python
pip install -r requirements.txt
```

### 2. Run Migrations

```bash
cd django_backend
python manage.py migrate
```

### 3. Seed Mock Data

```bash
python manage.py seed_mock_data
```

### 4. Create Superuser (optional)

```bash
python manage.py createsuperuser
```

### 5. Start DRF Server

```bash
python manage.py runserver 8000
```

Or use the helper script:

```bash
bash run_drf.sh
```

### 6. Test Endpoints

```bash
curl http://localhost:8000/api/health/
curl http://localhost:8000/api/properties/
curl http://localhost:8000/api/stats/properties/
```

### 7. Update Frontend API Base URL

**Option A:** Environment variable (recommended)

```bash
# .env.local
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**Option B:** Direct edit in `client/lib/api.ts`

```typescript
export const API_BASE = "http://127.0.0.1:8000";
```

**Option C:** Run both backends (Flask on 5000, DRF on 8000) concurrently and switch via env var.

---

## JWT Authentication Integration

### Obtain Token

```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Use Token in Requests

```bash
curl http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Frontend Integration

```typescript
// client/lib/api.ts

export async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("access_token");
  
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, refresh or logout
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
}

// Login function
export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const { access, refresh } = await response.json();
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  return { access, refresh };
}

// Refresh token
export async function refreshToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");

  const response = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw new Error("Refresh failed");
  }

  const { access } = await response.json();
  localStorage.setItem("access_token", access);
  return access;
}
```

---

## Database Models

### Core Models

1. **Property**
   - name, description, property_type, location, address, city, state, zip_code
   - price, size, bedrooms, bathrooms, year_built
   - status (available, rented, maintenance)
   - amenities (JSON), lat, lng

2. **Tenant**
   - name, email, phone
   - property (FK)
   - lease_start_date, lease_end_date, monthly_rent

3. **Payment**
   - id (string PK), amount, due_date, paid_date
   - status (paid, pending, overdue)
   - tenant (FK), property (FK)

4. **Invoice**
   - id (string PK), amount, issue_date, due_date
   - description, generated_at
   - payment (FK), tenant (FK), property (FK)

---

## Admin Panel

Access Django admin at: `http://localhost:8000/admin/`

Models registered:
- Properties
- Tenants
- Payments
- Invoices

---

## Serializer Highlights

All serializers include nested ForeignKey IDs for frontend convenience:

```python
class PaymentSerializer(serializers.ModelSerializer):
    tenant_id = serializers.IntegerField(source="tenant.id", read_only=True)
    property_id = serializers.IntegerField(source="property.id", read_only=True)
```

---

## ViewSets & Permissions

**Default Permission:** `AllowAny` (matches current Flask setup)

To enable JWT authentication per-endpoint:

```python
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]  # Change here
```

---

## Stats Endpoints

### `/api/stats/properties/`

```json
{
  "total_properties": 8,
  "rented_count": 3,
  "available_count": 5,
  "maintenance_count": 0,
  "occupancy_rate": 37.5,
  "total_monthly_revenue": 8700.00,
  "average_rent": 3075.00
}
```

### `/api/stats/payments/`

```json
{
  "total_payments": 11,
  "paid_count": 6,
  "pending_count": 5,
  "overdue_count": 0,
  "total_paid": 16800.00,
  "total_pending": 16800.00,
  "total_overdue": 0.00
}
```

### `/api/stats/revenue-trends/`

Returns last 6 months of revenue trends (matches Flask API).

### `/api/stats/dashboard/`

Aggregates all stats in one response:

```json
{
  "properties": {...},
  "payments": {...},
  "revenue_trends": [...]
}
```

---

## Testing

### Run Django Tests

```bash
cd django_backend
python manage.py test
```

### Check API Health

```bash
curl http://localhost:8000/api/health/
```

Expected:
```json
{
  "status": "healthy",
  "service": "Los Santos Builders DRF API"
}
```

---

## Production Deployment

### With Gunicorn

```bash
cd django_backend
gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Environment Variables

```bash
export DJANGO_SECRET_KEY="your-production-secret-key"
export DJANGO_DEBUG=0
export DJANGO_ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"
```

### Database

For production, switch from SQLite to PostgreSQL:

```python
# backend/settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "los_santos"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}
```

---

## Backward Compatibility Wrapper (Optional)

To wrap DRF responses in `{success: true, data: ...}` format:

```python
# apps/core/renderers.py
from rest_framework.renderers import JSONRenderer

class WrappedJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response")
        if response and response.status_code >= 400:
            wrapped = {"success": False, "error": data}
        else:
            wrapped = {"success": True, "data": data}
        return super().render(wrapped, accepted_media_type, renderer_context)
```

Then in `settings.py`:

```python
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": (
        "apps.core.renderers.WrappedJSONRenderer",
    ),
    ...
}
```

---

## Frontend Changes Required

### Minimal (Recommended)

1. Update API base URL: `VITE_API_BASE_URL=http://127.0.0.1:8000`
2. Change response parsing from `data.data` to `data` (if not using wrapper)

### With JWT Auth

1. Add login flow to obtain tokens
2. Store tokens in localStorage
3. Add `Authorization: Bearer <token>` header to requests
4. Handle token refresh on 401 responses

---

## Rollback Plan

If issues arise:

1. Keep Flask server running on port 5000
2. Switch frontend back to Flask: `VITE_API_BASE_URL=http://127.0.0.1:5000`
3. No code changes needed (Flask responses remain unchanged)

---

## Next Steps

1. ✅ Dependencies installed
2. ✅ Migrations run
3. ✅ Mock data seeded
4. ⏳ Test all endpoints
5. ⏳ Update frontend API base URL
6. ⏳ Test full integration
7. ⏳ Deploy to production

---

## File Structure

```
python/
├── django_backend/
│   ├── backend/
│   │   ├── settings.py      # Django configuration
│   │   ├── urls.py          # Root URL config
│   │   ├── wsgi.py          # WSGI entry
│   │   └── asgi.py          # ASGI entry
│   ├── apps/
│   │   └── core/
│   │       ├── models.py    # Property, Tenant, Payment, Invoice
│   │       ├── serializers.py
│   │       ├── views.py     # ViewSets + stats endpoints
│   │       ├── urls.py      # API routes
│   │       ├── admin.py     # Admin panel config
│   │       └── management/
│   │           └── commands/
│   │               └── seed_mock_data.py
│   ├── manage.py
│   └── db.sqlite3           # Database (auto-created)
├── api.py                   # Flask API (legacy)
├── requirements.txt         # Updated with Django deps
└── run_drf.sh               # DRF launcher script
```

---

## Support

For issues or questions:
- Check Django logs: `python manage.py runserver` output
- Verify database: `python manage.py dbshell`
- Run management commands: `python manage.py <command>`

---

**Status:** ✅ Django REST Framework backend ready for migration

**Frontend changes:** Minimal (API base URL only)

**Data:** Fully seeded from existing mock data

**Authentication:** JWT ready (optional activation per-endpoint)
