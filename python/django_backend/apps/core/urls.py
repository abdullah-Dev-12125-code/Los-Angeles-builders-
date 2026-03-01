from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    InvoiceViewSet,
    PaymentViewSet,
    PropertyViewSet,
    TenantViewSet,
    auth_me,
    dashboard_stats,
    demo,
    health_check,
    payment_stats,
    ping,
    property_stats,
    revenue_trends,
    user_login,
    user_register,
)

router = DefaultRouter()
router.register(r"properties", PropertyViewSet, basename="property")
router.register(r"tenants", TenantViewSet, basename="tenant")
router.register(r"payments", PaymentViewSet, basename="payment")
router.register(r"invoices", InvoiceViewSet, basename="invoice")

urlpatterns = [
    path("", include(router.urls)),
    path("health/", health_check),
    path("ping/", ping),
    path("demo/", demo),
    path("payments/stats/", payment_stats),
    path("stats/payments/", payment_stats),
    path("stats/properties/", property_stats),
    path("stats/revenue-trends/", revenue_trends),
    path("stats/dashboard/", dashboard_stats),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", auth_me, name="auth_me"),
    path("auth/login/", user_login, name="user_login"),
    path("auth/register/", user_register, name="user_register"),
]
