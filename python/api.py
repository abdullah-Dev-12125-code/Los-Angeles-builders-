"""Flask API backend for Los Santos Builders real estate management system."""

from flask import Flask, jsonify
from flask_cors import CORS
from data.mock_data import (
    get_properties,
    get_tenants,
    get_payments,
    get_invoices,
    get_payment_stats,
    get_property_stats,
    get_revenue_trends,
)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend


# ==================== PROPERTIES ENDPOINTS ====================
@app.route("/api/properties", methods=["GET"])
def get_all_properties():
    """Get all properties."""
    try:
        properties = get_properties()
        return jsonify({"success": True, "data": properties}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/properties/<property_id>", methods=["GET"])
def get_property_detail(property_id):
    """Get a specific property by ID."""
    try:
        property_data = get_properties()
        prop = next((p for p in property_data if p["id"] == property_id), None)
        if not prop:
            return jsonify({"success": False, "error": "Property not found"}), 404
        return jsonify({"success": True, "data": prop}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ==================== TENANTS ENDPOINTS ====================
@app.route("/api/tenants", methods=["GET"])
def get_all_tenants():
    """Get all tenants."""
    try:
        tenants = get_tenants()
        return jsonify({"success": True, "data": tenants}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/tenants/<tenant_id>", methods=["GET"])
def get_tenant_detail(tenant_id):
    """Get a specific tenant by ID."""
    try:
        tenants = get_tenants()
        tenant = next((t for t in tenants if t["id"] == tenant_id), None)
        if not tenant:
            return jsonify({"success": False, "error": "Tenant not found"}), 404
        return jsonify({"success": True, "data": tenant}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ==================== PAYMENTS ENDPOINTS ====================
@app.route("/api/payments", methods=["GET"])
def get_all_payments():
    """Get all payments."""
    try:
        payments = get_payments()
        return jsonify({"success": True, "data": payments}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/payments/stats", methods=["GET"])
def get_payment_statistics():
    """Get payment statistics."""
    try:
        stats = get_payment_stats()
        return jsonify({"success": True, "data": stats}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ==================== INVOICES ENDPOINTS ====================
@app.route("/api/invoices", methods=["GET"])
def get_all_invoices():
    """Get all invoices."""
    try:
        invoices = get_invoices()
        return jsonify({"success": True, "data": invoices}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ==================== ANALYTICS/STATS ENDPOINTS ====================
@app.route("/api/stats/properties", methods=["GET"])
def get_property_statistics():
    """Get property statistics."""
    try:
        stats = get_property_stats()
        return jsonify({"success": True, "data": stats}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/stats/revenue-trends", methods=["GET"])
def get_revenue_trend_data():
    """Get revenue trends."""
    try:
        trends = get_revenue_trends()
        return jsonify({"success": True, "data": trends}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/stats/dashboard", methods=["GET"])
def get_dashboard_stats():
    """Get all dashboard statistics."""
    try:
        property_stats = get_property_stats()
        payment_stats = get_payment_stats()
        revenue_trends = get_revenue_trends()
        
        return jsonify({
            "success": True,
            "data": {
                "properties": property_stats,
                "payments": payment_stats,
                "revenue_trends": revenue_trends,
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ==================== HEALTH CHECK ====================
@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "Los Santos Builders API"}), 200


# ==================== ERROR HANDLERS ====================
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({"success": False, "error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({"success": False, "error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
