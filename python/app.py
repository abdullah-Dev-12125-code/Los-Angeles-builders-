"""Python Dash analytics dashboard for Los Santos Builders real estate management."""

import dash
from dash import dcc, html, callback, Input, Output, State
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from data.mock_data import (
    get_properties,
    get_tenants,
    get_payments,
    get_property_stats,
    get_payment_stats,
    get_revenue_trends,
)

# Initialize Dash app with Bootstrap theme
app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP],
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1"}
    ],
)

# Custom colors for Los Santos Builders branding
COLORS = {
    "primary": "#0F6EEB",      # Blue
    "secondary": "#1E3B8A",    # Dark Blue
    "success": "#10B981",      # Green
    "danger": "#EF4444",       # Red
    "warning": "#F59E0B",      # Orange
    "info": "#3B82F6",         # Light Blue
    "light": "#F3F4F6",        # Light Gray
    "dark": "#1F2937",         # Dark Gray
}


def get_stat_card(title, value, icon, color):
    """Create a statistic card component."""
    return dbc.Col([
        dbc.Card([
            dbc.CardBody([
                html.Div([
                    html.Div(
                        html.I(className=f"fas {icon} fa-2x"),
                        style={"color": color, "marginRight": "15px"},
                    ),
                    html.Div([
                        html.P(title, className="mb-2", style={"fontSize": "12px", "color": "#6B7280"}),
                        html.H4(str(value), className="mb-0", style={"fontWeight": "bold"}),
                    ]),
                ], style={"display": "flex", "alignItems": "center"}),
            ])
        ], style={"borderLeft": f"5px solid {color}"})
    ], md=3, className="mb-4")


# ==================== NAVBAR ====================
navbar = dbc.Navbar([
    dbc.Container([
        dbc.Row([
            dbc.Col([
                html.Div([
                    html.Img(
                        src="https://cdn.builder.io/api/v1/image/assets%2F051c3d806a84458aa3b6d2a840d9a54d%2Febe722c15e9c44dea9e277bd4351ceb5?format=webp&width=100&height=100",
                        height="40px",
                        style={"marginRight": "10px"},
                    ),
                    html.Span("Los Santos Builders", style={"fontSize": "20px", "fontWeight": "bold", "color": "white"}),
                ], style={"display": "flex", "alignItems": "center"}),
            ], width="auto"),
            dbc.Col([
                dbc.Nav([
                    dbc.NavLink("Dashboard", href="/", active="exact", style={"color": "white", "marginRight": "20px"}),
                    dbc.NavLink("Analytics", href="/analytics", active="exact", style={"color": "white", "marginRight": "20px"}),
                    dbc.NavLink("Properties", href="/properties", active="exact", style={"color": "white", "marginRight": "20px"}),
                    dbc.NavLink("Payments", href="/payments", active="exact", style={"color": "white"}),
                ], navbar=True),
            ], width="auto", style={"marginLeft": "auto"}),
        ], align="center"),
    ], fluid=True),
], color=COLORS["primary"], dark=True, className="mb-4", sticky="top")


# ==================== DASHBOARD PAGE ====================
def create_dashboard_page():
    """Create the main dashboard page."""
    props_stats = get_property_stats()
    payment_stats = get_payment_stats()
    revenue_data = get_revenue_trends()
    
    # Create revenue chart
    df_revenue = pd.DataFrame(revenue_data)
    fig_revenue = go.Figure()
    fig_revenue.add_trace(go.Scatter(
        x=df_revenue["month"], y=df_revenue["rental_income"],
        name="Rental Income", mode="lines+markers",
        line=dict(color=COLORS["primary"], width=3),
        marker=dict(size=8),
    ))
    fig_revenue.add_trace(go.Scatter(
        x=df_revenue["month"], y=df_revenue["total_revenue"],
        name="Total Revenue", mode="lines+markers",
        line=dict(color=COLORS["secondary"], width=3),
        marker=dict(size=8),
    ))
    fig_revenue.update_layout(
        title="Revenue Trends (Last 6 Months)",
        hovermode="x unified",
        template="plotly_white",
        height=400,
        margin=dict(l=0, r=0, t=30, b=0),
    )
    
    # Create occupancy pie chart
    property_data = [
        {"status": "Rented", "count": props_stats["rented_count"], "color": COLORS["success"]},
        {"status": "Available", "count": props_stats["available_count"], "color": COLORS["warning"]},
        {"status": "Maintenance", "count": props_stats["maintenance_count"], "color": COLORS["danger"]},
    ]
    df_property = pd.DataFrame(property_data)
    fig_property = go.Figure(data=[go.Pie(
        labels=df_property["status"],
        values=df_property["count"],
        marker=dict(colors=df_property["color"]),
        hole=0.4,
    )])
    fig_property.update_layout(
        title="Property Status Distribution",
        height=400,
        margin=dict(l=0, r=0, t=30, b=0),
    )
    
    # Create payment status chart
    payment_data = [
        {"status": "Paid", "count": payment_stats["paid_count"], "color": COLORS["success"]},
        {"status": "Pending", "count": payment_stats["pending_count"], "color": COLORS["warning"]},
        {"status": "Overdue", "count": payment_stats["overdue_count"], "color": COLORS["danger"]},
    ]
    df_payment = pd.DataFrame(payment_data)
    fig_payment = go.Figure(data=[go.Bar(
        x=df_payment["status"],
        y=df_payment["count"],
        marker=dict(color=df_payment["color"]),
        text=df_payment["count"],
        textposition="auto",
    )])
    fig_payment.update_layout(
        title="Payment Status Overview",
        height=400,
        margin=dict(l=0, r=0, t=30, b=0),
        template="plotly_white",
    )
    
    return dbc.Container([
        # Header
        html.Div([
            html.H1("Dashboard", className="mb-1"),
            html.P("Real-time analytics and property management overview", style={"color": "#6B7280"}),
        ], className="mb-4"),
        
        # Stats Cards
        dbc.Row([
            get_stat_card("Total Properties", props_stats["total_properties"], "fa-building", COLORS["primary"]),
            get_stat_card("Rented Properties", props_stats["rented_count"], "fa-home", COLORS["success"]),
            get_stat_card("Available", props_stats["available_count"], "fa-door-open", COLORS["warning"]),
            get_stat_card("Monthly Revenue", f"${props_stats['total_monthly_revenue']:,.0f}", "fa-dollar-sign", COLORS["info"]),
        ], className="mb-4"),
        
        dbc.Row([
            get_stat_card("Total Payments", payment_stats["total_payments"], "fa-credit-card", COLORS["primary"]),
            get_stat_card("Paid", payment_stats["paid_count"], "fa-check-circle", COLORS["success"]),
            get_stat_card("Pending", payment_stats["pending_count"], "fa-clock", COLORS["warning"]),
            get_stat_card("Overdue", payment_stats["overdue_count"], "fa-exclamation-circle", COLORS["danger"]),
        ], className="mb-4"),
        
        # Charts
        dbc.Row([
            dbc.Col([dcc.Graph(figure=fig_revenue)], md=8),
            dbc.Col([dcc.Graph(figure=fig_property)], md=4),
        ], className="mb-4"),
        
        dbc.Row([
            dbc.Col([dcc.Graph(figure=fig_payment)], md=12),
        ], className="mb-4"),
        
    ], fluid=True, className="mt-4")


# ==================== PROPERTIES PAGE ====================
def create_properties_page():
    """Create the properties analytics page."""
    properties = get_properties()
    df = pd.DataFrame(properties)
    
    # Create property distribution by neighborhood
    fig_location = df.groupby("location").size().reset_index(name="count")
    fig_location = px.bar(
        fig_location, x="location", y="count",
        title="Properties by Neighborhood",
        labels={"location": "Location", "count": "Number of Properties"},
        color="count",
        color_continuous_scale=["#F3F4F6", COLORS["primary"]],
    )
    fig_location.update_layout(height=400, template="plotly_white")
    
    # Create property price distribution
    fig_price = px.histogram(
        df, x="price",
        nbins=20,
        title="Price Distribution",
        labels={"price": "Monthly Rent ($)"},
        color_discrete_sequence=[COLORS["primary"]],
    )
    fig_price.update_layout(height=400, template="plotly_white")
    
    # Create property type distribution
    fig_type = px.pie(
        df.groupby("type").size().reset_index(name="count"),
        names="type", values="count",
        title="Property Types",
        color_discrete_sequence=[COLORS["primary"], COLORS["secondary"], COLORS["success"], COLORS["warning"]],
    )
    fig_type.update_layout(height=400)
    
    return dbc.Container([
        html.H1("Properties Analytics", className="mb-4 mt-4"),
        
        dbc.Row([
            dbc.Col([dcc.Graph(figure=fig_location)], md=6),
            dbc.Col([dcc.Graph(figure=fig_price)], md=6),
        ], className="mb-4"),
        
        dbc.Row([
            dbc.Col([dcc.Graph(figure=fig_type)], md=6),
        ], className="mb-4"),
        
        # Properties Table
        html.Div([
            html.H4("All Properties", className="mb-3"),
            dbc.Table.from_dataframe(
                df[["name", "type", "location", "price", "bedrooms", "bathrooms", "status"]].head(10),
                striped=True,
                bordered=True,
                hover=True,
                responsive=True,
                className="mb-4",
            )
        ], style={"overflowX": "auto"}),
        
    ], fluid=True)


# ==================== PAYMENTS PAGE ====================
def create_payments_page():
    """Create the payments analytics page."""
    payments = get_payments()
    df = pd.DataFrame(payments)
    
    # Payment status over time
    payment_summary = df.groupby("status").agg({"amount": "sum"}).reset_index()
    fig_status = px.bar(
        payment_summary, x="status", y="amount",
        title="Total Payment Amount by Status",
        labels={"amount": "Amount ($)", "status": "Status"},
        color="status",
        color_discrete_map={
            "paid": COLORS["success"],
            "pending": COLORS["warning"],
            "overdue": COLORS["danger"],
        }
    )
    fig_status.update_layout(height=400, template="plotly_white")
    
    # Payment count by status
    payment_count = df.groupby("status").size().reset_index(name="count")
    fig_count = px.pie(
        payment_count, names="status", values="count",
        title="Payment Count by Status",
        color_discrete_map={
            "paid": COLORS["success"],
            "pending": COLORS["warning"],
            "overdue": COLORS["danger"],
        }
    )
    fig_count.update_layout(height=400)
    
    return dbc.Container([
        html.H1("Payments Analytics", className="mb-4 mt-4"),
        
        dbc.Row([
            dbc.Col([dcc.Graph(figure=fig_status)], md=6),
            dbc.Col([dcc.Graph(figure=fig_count)], md=6),
        ], className="mb-4"),
        
        # Payments Table
        html.Div([
            html.H4("Recent Payments", className="mb-3"),
            dbc.Table.from_dataframe(
                df[["id", "tenant_id", "amount", "due_date", "paid_date", "status"]].head(20),
                striped=True,
                bordered=True,
                hover=True,
                responsive=True,
                className="mb-4",
            )
        ], style={"overflowX": "auto"}),
        
    ], fluid=True)


# ==================== APP LAYOUT ====================
app.layout = html.Div([
    navbar,
    dcc.Location(id="url", refresh=False),
    html.Div(id="page-content"),
])


# ==================== PAGE ROUTING ====================
@callback(Output("page-content", "children"), Input("url", "pathname"))
def display_page(pathname):
    """Route to different pages based on pathname."""
    if pathname == "/properties":
        return create_properties_page()
    elif pathname == "/payments":
        return create_payments_page()
    else:
        return create_dashboard_page()


# ==================== CUSTOM CSS ====================
app.index_string = """
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>Los Santos Builders Analytics</title>
        {%favicon%}
        {%css%}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                background-color: #F9FAFB;
            }}
            .navbar {{
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }}
        </style>
    </head>
    <body>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>
"""


if __name__ == "__main__":
    app.run_server(debug=True, port=8050, host="0.0.0.0")
