# Los Santos Builders - Python Dash Analytics Dashboard

A professional Python Dash analytics dashboard for the Los Santos Builders real estate management system.

## Project Structure

```
python/
├── app.py                  # Main Dash application
├── api.py                  # Flask API backend
├── data/
│   └── mock_data.py       # Mock data for development
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Features

### Dashboard Page

- **Real-time Statistics**: Total properties, rented, available, and monthly revenue
- **Payment Overview**: Paid, pending, and overdue payment tracking
- **Revenue Trends**: Interactive line chart showing rental income and total revenue
- **Property Distribution**: Pie chart showing property status distribution
- **Payment Status**: Bar chart showing payment status breakdown

### Properties Analytics Page

- Properties by neighborhood/location
- Price distribution histogram
- Property type distribution
- Properties data table

### Payments Analytics Page

- Total payment amount by status
- Payment count by status
- Recent payments data table

### API Backend (Flask)

- `/api/properties` - Get all properties
- `/api/tenants` - Get all tenants
- `/api/payments` - Get all payments
- `/api/invoices` - Get all invoices
- `/api/stats/properties` - Property statistics
- `/api/stats/payments` - Payment statistics
- `/api/stats/revenue-trends` - Revenue trends
- `/api/stats/dashboard` - Complete dashboard data

## Installation

### 1. Install Python (3.9+)

Make sure you have Python 3.9 or higher installed. Check with:

```bash
python --version
```

### 2. Create Virtual Environment (Optional but Recommended)

```bash
# On macOS/Linux
python -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Applications

### Option 1: Run Dash Dashboard Only

```bash
cd python
python app.py
```

Then open your browser and go to: `http://localhost:8050`

### Option 2: Run Flask API Server

```bash
cd python
python api.py
```

The API will be available at: `http://localhost:5000`

### Option 3: Run Both (in separate terminals)

**Terminal 1 - Start Flask API:**

```bash
cd python
python api.py
```

**Terminal 2 - Start Dash Dashboard:**

```bash
cd python
python app.py
```

## API Endpoints Reference

### Properties

- `GET /api/properties` - All properties
- `GET /api/properties/<id>` - Single property

### Tenants

- `GET /api/tenants` - All tenants
- `GET /api/tenants/<id>` - Single tenant

### Payments

- `GET /api/payments` - All payments
- `GET /api/payments/stats` - Payment statistics

### Invoices

- `GET /api/invoices` - All invoices

### Analytics

- `GET /api/stats/properties` - Property statistics
- `GET /api/stats/revenue-trends` - Revenue trends (last 6 months)
- `GET /api/stats/dashboard` - All dashboard data

### Health

- `GET /api/health` - API health check

## Example API Calls

### Get All Properties

```bash
curl http://localhost:5000/api/properties
```

### Get Property Stats

```bash
curl http://localhost:5000/api/stats/properties
```

### Get Dashboard Data

```bash
curl http://localhost:5000/api/stats/dashboard
```

## Mock Data

The application uses mock data stored in `data/mock_data.py`. This includes:

- **8 Properties**: Mix of apartments across Los Angeles neighborhoods
- **3 Tenants**: Current tenants with lease information
- **11 Payments**: Payment history with various statuses
- **4 Invoices**: Monthly rent invoices

To modify the data, edit `data/mock_data.py`.

## Styling & Colors

The dashboard uses a professional color scheme:

- **Primary Blue**: #0F6EEB
- **Dark Blue**: #1E3B8A
- **Success Green**: #10B981
- **Warning Orange**: #F59E0B
- **Danger Red**: #EF4444

All components match the Los Santos Builders brand identity.

## Dashboard Pages

### 1. Dashboard (Home Page)

- Overview statistics
- Revenue trends chart
- Property status distribution
- Payment status overview

### 2. Properties Analytics

- Properties by location
- Price distribution
- Property types
- Properties list table

### 3. Payments Analytics

- Payment amounts by status
- Payment count breakdown
- Recent payments table

## Connecting React Frontend to Python Backend

To connect your React frontend to the Python API:

1. Update API base URL in React environment variables
2. Change API calls to point to `http://localhost:5000/api/`
3. Example:

```javascript
fetch("http://localhost:5000/api/properties")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## Production Deployment

### Using Gunicorn (Flask)

```bash
gunicorn -w 4 -b 0.0.0.0:5000 api:app
```

### Using Gunicorn (Dash)

```bash
gunicorn -w 4 -b 0.0.0.0:8050 "app:app.server"
```

### Docker Deployment

See the included `Dockerfile` and `docker-compose.yml` for containerized deployment.

## Troubleshooting

### Port Already in Use

- Dash: Change port in `app.py` line `app.run_server(debug=True, port=8050)`
- Flask: Change port in `api.py` line `app.run(debug=True, port=5000)`

### Import Errors

- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Verify you're in the correct directory: `cd python`

### CORS Issues

- Flask API has CORS enabled automatically via `CORS(app)`
- If still experiencing issues, check browser console for specific errors

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Real-time data updates with websockets
- [ ] Export reports to PDF/Excel
- [ ] Multi-language support
- [ ] Mobile responsive design improvements
- [ ] Email notifications
- [ ] Advanced analytics and forecasting

## Support

For issues or questions, refer to:

- [Dash Documentation](https://dash.plotly.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Plotly Documentation](https://plotly.com/python/)

## License

Copyright © 2024 Los Santos Builders. All rights reserved.
