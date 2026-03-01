from django.contrib import admin
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import include, path
    

def welcome_redirect(request):
    """Redirect to React frontend welcome page"""
    return redirect('http://localhost:8080/')


def api_root(request):
    return JsonResponse({
        "service": "Los Santos Builders - Django REST Framework API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "api_properties": "/api/properties/",
            "api_tenants": "/api/tenants/",
            "api_payments": "/api/payments/",
            "api_invoices": "/api/invoices/",
            "api_stats_properties": "/api/stats/properties/",
            "api_stats_payments": "/api/stats/payments/",
            "api_stats_revenue": "/api/stats/revenue-trends/",
            "api_stats_dashboard": "/api/stats/dashboard/",
            "api_health": "/api/health/",
            "api_auth_token": "/api/auth/token/",
            "api_auth_refresh": "/api/auth/token/refresh/",
            "api_auth_me": "/api/auth/me/",
        },
        "documentation": "Visit /api/ for browsable API interface"
    })


urlpatterns = [
    path("", welcome_redirect, name="welcome"),
    path("api-info/", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    path("api/", include("apps.core.urls")),
]
