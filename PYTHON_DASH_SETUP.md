# Los Santos Builders - Python Dash Analytics Dashboard

## Overview

Your Real Estate Management System now includes a **professional Python Dash analytics dashboard** while keeping your existing React frontend intact.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                React Frontend (Existing)                 │
│          http://localhost:3000 or /welcome              │
└──────────────────────────────────────────────────────────┘
                              ↕
┌──────────────────────────────────────────────────────────┐
│           Python Flask API Backend (New)                │
│         http://localhost:5000/api/*                     │
└──────────────────────────────────────────────────────────┘
                              ↕
┌──────────────────────────────────────────────────────────┐
│      Python Dash Analytics Dashboard (New)              │
│         http://localhost:8050                           │
└──────────────────────────────────────────────────────────┘
```

## What's New

### 1. Python Dash Analytics Dashboard (`python/app.py`)

- **Professional UI** with Los Santos Builders branding
- **Real-time Analytics** with Plotly visualizations
- **4 Main Pages**:
  - Dashboard (overview, stats, charts)
  - Properties Analytics (location distribution, pricing)
  - Payments Analytics (payment tracking)
  - Multi-page navigation with clean routing

### 2. Flask API Backend (`python/api.py`)

- **RESTful API** serving property, tenant, payment, and analytics data
- **CORS Enabled** for React frontend integration
- **12 Endpoints** including:
  - `/api/properties`
  - `/api/payments`
  - `/api/stats/dashboard`
  - `/api/stats/revenue-trends`
  - And more...

### 3. Mock Data Module (`python/data/mock_data.py`)

- **Python-based mock data** with all Los Angeles properties
- **Data functions** for easy access and statistics
- **Extensible structure** for future database integration

### 4. Configuration Management (`python/config.py`)

- **Environment-based settings** (development/production)
- **Brand colors** matching your Los Santos design
- **Feature flags** for future enhancements

## File Structure

```
python/
├── app.py                    # Main Dash dashboard application
├── api.py                    # Flask API backend server
├── config.py                 # Configuration management
├── run.sh                    # Quick start script
├── setup.sh                  # Environment setup script
├── requirements.txt          # Python dependencies
├── Dockerfile                # Docker container definition
├── docker-compose.yml        # Multi-container setup
├── .gitignore               # Git ignore rules
├── README.md                # Detailed documentation
└── data/
    ├── __init__.py          # Python package init
    └── mock_data.py         # Mock data with 8 properties, 3 tenants, 11 payments
```

## Quick Start Guide

### Method 1: Quick Start (Recommended)

```bash
# Navigate to python directory
cd python

# Make run script executable
chmod +x run.sh

# Run both applications
./run.sh
```

Then open:

- **Dash Dashboard**: http://localhost:8050
- **Flask API**: http://localhost:5000

### Method 2: Manual Setup

```bash
cd python

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Terminal 1: Start Flask API
python api.py

# Terminal 2: Start Dash Dashboard
python app.py
```

### Method 3: Docker Setup

```bash
cd python

# Build and run with Docker Compose
docker-compose up

# Or build manually
docker build -t los-santos-python .
docker run -p 5000:5000 -p 8050:8050 los-santos-python
```

## Dashboard Features

### Dashboard Page (Home)

![Dashboard Features]

- **Statistics Cards**: Total properties, rented count, available, monthly revenue
- **Payment Overview**: Paid, pending, overdue payments
- **Revenue Trends**: 6-month interactive line chart
- **Property Distribution**: Pie chart of property status
- **Payment Status**: Bar chart of payment breakdown

### Properties Analytics

- Properties by neighborhood/location
- Monthly rent price distribution
- Property types breakdown
- Complete properties data table

### Payments Analytics

- Total payment amounts by status
- Payment count distribution
- Recent payments detailed table
- Status breakdown (Paid, Pending, Overdue)

## API Endpoints Reference

### Properties

```
GET /api/properties                    # All properties
GET /api/properties/<property_id>      # Single property
```

### Tenants

```
GET /api/tenants                       # All tenants
GET /api/tenants/<tenant_id>           # Single tenant
```

### Payments

```
GET /api/payments                      # All payments
GET /api/payments/stats                # Payment statistics
```

### Invoices

```
GET /api/invoices                      # All invoices
```

### Analytics

```
GET /api/stats/properties              # Property statistics
GET /api/stats/revenue-trends          # Revenue trends (6 months)
GET /api/stats/dashboard               # Complete dashboard data
```

### Health Check

```
GET /api/health                        # API status check
```

## Connecting React Frontend to Python Backend

To connect your React app to the Python Flask API:

### 1. Update Environment Variables (React)

```bash
# .env or .env.local
VITE_API_URL=http://localhost:5000/api
```

### 2. Update API Calls in React

**Before (using mock data):**

```javascript
import { mockProperties } from "@/lib/mock-data";
const properties = mockProperties;
```

**After (using Python API):**

```javascript
const [properties, setProperties] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/properties")
    .then((res) => res.json())
    .then((data) => setProperties(data.data))
    .catch((err) => console.error(err));
}, []);
```

### 3. Example: Update Properties.tsx

```typescript
import { useEffect, useState } from "react";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/properties");
        const data = await response.json();
        setProperties(data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ... rest of component
}
```

## Data Structure Examples

### Property Object

```python
{
  "id": "1",
  "name": "Sunset Hills Luxury Apartments",
  "type": "apartment",
  "price": 2800,
  "location": "Los Angeles, CA",
  "address": "1234 Sunset Boulevard, Los Angeles, CA 90028",
  "size": 1450,
  "bedrooms": 2,
  "bathrooms": 2,
  "status": "rented",
  "amenities": ["Gym", "Parking", "Pool"],
}
```

### Payment Object

```python
{
  "id": "P-LSB-001",
  "tenant_id": "1",
  "property_id": "1",
  "amount": 2800,
  "due_date": "2024-02-01",
  "paid_date": "2024-02-01",
  "status": "paid"
}
```

## Available Commands

### Python Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Deactivate
deactivate
```

### Python Application

```bash
# Install dependencies
pip install -r requirements.txt

# Run Dash dashboard
python app.py

# Run Flask API
python api.py

# Run both
./run.sh

# Run with Docker
docker-compose up
```

## Configuration

### Environment Variables

Create a `.env` file in the `python/` directory:

```env
# Environment
ENVIRONMENT=production

# Flask
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Dash
DASH_HOST=0.0.0.0
DASH_PORT=8050

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Database (future)
DATABASE_URL=postgresql://user:pass@localhost/los_santos
```

## Performance Optimization

### For Development

- Dashboard debug mode enabled
- Auto-reload on code changes
- Detailed error messages

### For Production

- Disable debug mode in `config.py`
- Use Gunicorn for production serving
- Enable caching for static assets
- Compress API responses

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8050  # Dash
lsof -i :5000  # Flask

# Kill process
kill -9 <PID>

# Or change port in config.py
```

### CORS Errors

- Ensure Flask API has CORS enabled
- Check `CORS_ORIGINS` in configuration
- Verify React frontend URL is in allowed origins

### Import Errors

```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Check Python version
python --version  # Should be 3.9+
```

### Virtual Environment Issues

```bash
# Remove and recreate
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Production Deployment

### Using Gunicorn

**Flask API:**

```bash
gunicorn -w 4 -b 0.0.0.0:5000 api:app
```

**Dash Dashboard:**

```bash
gunicorn -w 4 -b 0.0.0.0:8050 "app:app.server"
```

### Using Docker Compose

```bash
docker-compose -f docker-compose.yml up -d
```

### Using systemd (Linux)

Create `/etc/systemd/system/los-santos-api.service`:

```ini
[Unit]
Description=Los Santos Builders API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/los-santos/python
ExecStart=/opt/los-santos/python/venv/bin/python api.py
Restart=always

[Install]
WantedBy=multi-user.target
```

## Future Enhancements

- [ ] Real database integration (PostgreSQL)
- [ ] User authentication and authorization
- [ ] WebSocket support for real-time updates
- [ ] Advanced analytics and forecasting
- [ ] Report generation (PDF/Excel)
- [ ] Email notifications
- [ ] Payment integration (Stripe/PayPal)
- [ ] Multi-user support with roles
- [ ] Data import/export functionality
- [ ] Advanced filtering and search

## Monitoring & Logging

### Enable Logging

In `python/config.py`:

```python
LOG_LEVEL = "INFO"
LOG_FILE = "logs/app.log"
```

### View Logs

```bash
tail -f logs/app.log
```

## Support & Documentation

### Key Documentation Files

- `python/README.md` - Detailed Python setup guide
- `python/config.py` - Configuration options
- `python/data/mock_data.py` - Data structure reference

### External Resources

- [Dash Documentation](https://dash.plotly.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Plotly Documentation](https://plotly.com/python/)
- [Dash Bootstrap Components](https://dash-bootstrap-components.opensource.faculty.ai/)

## Summary of New Files

✅ **Python Application Files**

- `python/app.py` - Dash dashboard (368 lines)
- `python/api.py` - Flask API (163 lines)
- `python/config.py` - Configuration management (92 lines)
- `python/data/mock_data.py` - Mock data (410 lines)
- `python/data/__init__.py` - Package initialization

✅ **Configuration & Setup**

- `requirements.txt` - Python dependencies
- `python/README.md` - Detailed setup guide
- `python/Dockerfile` - Docker container
- `python/docker-compose.yml` - Docker Compose configuration
- `python/setup.sh` - Automated environment setup
- `python/run.sh` - Quick start script
- `python/.gitignore` - Git ignore rules
- `PYTHON_DASH_SETUP.md` - This file

## Key Features Summary

| Feature             | React App | Dash Dashboard | Flask API |
| ------------------- | --------- | -------------- | --------- |
| User Interface      | ✅        | ✅             | ✅        |
| Property Management | ✅        | ✅             | ✅        |
| Tenant Management   | ✅        | ✅             | ✅        |
| Payment Tracking    | ✅        | ✅             | ✅        |
| Analytics           | ⭕        | ✅             | ✅        |
| Dark Mode           | ✅        | ⭕             | N/A       |
| Mobile Responsive   | ✅        | ⭕             | N/A       |
| Authentication      | ✅        | ⭕             | ⭕        |

✅ = Implemented | ⭕ = Planned | N/A = Not Applicable

## Contact & Support

For questions or issues with the Python Dashboard setup, refer to:

1. This guide (`PYTHON_DASH_SETUP.md`)
2. `python/README.md` for detailed setup
3. `python/config.py` for configuration options
4. External documentation links above

---

**Los Santos Builders Python Analytics Dashboard - Ready for Production! 🚀**
