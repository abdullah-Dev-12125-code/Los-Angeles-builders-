from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from .models import Invoice, Payment, Property, Tenant
from .serializers import (
    InvoiceSerializer,
    PaymentSerializer,
    PropertySerializer,
    TenantSerializer,
    UserSerializer,
)


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.select_related("property").all()
    serializer_class = TenantSerializer
    permission_classes = [AllowAny]


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("tenant", "property").all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.select_related("tenant", "property", "payment").all()
    serializer_class = InvoiceSerializer
    permission_classes = [AllowAny]


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(_request):
    return Response({"status": "healthy", "service": "Los Santos Builders DRF API"})


@api_view(["GET"])
@permission_classes([AllowAny])
def ping(_request):
    return Response({"message": "ping"})


@api_view(["GET"])
@permission_classes([AllowAny])
def demo(_request):
    return Response({"message": "Hello from Django REST Framework backend"})


@api_view(["GET"])
@permission_classes([AllowAny])
def payment_stats(_request):
    payments = Payment.objects.all()
    paid = payments.filter(status=Payment.STATUS_PAID)
    pending = payments.filter(status=Payment.STATUS_PENDING)
    overdue = payments.filter(status=Payment.STATUS_OVERDUE)

    return Response(
        {
            "total_payments": payments.count(),
            "paid_count": paid.count(),
            "pending_count": pending.count(),
            "overdue_count": overdue.count(),
            "total_paid": float(paid.aggregate(v=Coalesce(Sum("amount"), 0))["v"]),
            "total_pending": float(pending.aggregate(v=Coalesce(Sum("amount"), 0))["v"]),
            "total_overdue": float(overdue.aggregate(v=Coalesce(Sum("amount"), 0))["v"]),
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def property_stats(_request):
    properties = Property.objects.all()
    rented = properties.filter(status=Property.STATUS_RENTED)
    available = properties.filter(status=Property.STATUS_AVAILABLE)
    maintenance = properties.filter(status=Property.STATUS_MAINTENANCE)
    total = properties.count()

    return Response(
        {
            "total_properties": total,
            "rented_count": rented.count(),
            "available_count": available.count(),
            "maintenance_count": maintenance.count(),
            "occupancy_rate": round((rented.count() / total * 100), 1) if total else 0,
            "total_monthly_revenue": float(rented.aggregate(v=Coalesce(Sum("price"), 0))["v"]),
            "average_rent": float(properties.aggregate(v=Coalesce(Sum("price"), 0))["v"]) / total if total else 0,
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def revenue_trends(_request):
    return Response(
        [
            {"month": "Jan", "rental_income": 10500, "total_revenue": 55500},
            {"month": "Feb", "rental_income": 12800, "total_revenue": 62800},
            {"month": "Mar", "rental_income": 15300, "total_revenue": 70300},
            {"month": "Apr", "rental_income": 14200, "total_revenue": 62200},
            {"month": "May", "rental_income": 17600, "total_revenue": 79600},
            {"month": "Jun", "rental_income": 19500, "total_revenue": 89500},
        ]
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def dashboard_stats(request):
    return Response(
        {
            "properties": property_stats(request).data,
            "payments": payment_stats(request).data,
            "revenue_trends": revenue_trends(request).data,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def auth_me(request):
    return Response(UserSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    """
    User login endpoint - accepts email or username + password
    Returns: access_token, refresh_token, user info, and role
    """
    email_or_username = request.data.get("email") or request.data.get("username")
    password = request.data.get("password")
    role = request.data.get("role", "buyer")  # buyer or seller

    if not email_or_username or not password:
        return Response(
            {"error": "Email/username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Try to find user by email first, then by username
    try:
        user = User.objects.get(email=email_or_username)
    except User.DoesNotExist:
        try:
            user = User.objects.get(username=email_or_username)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    # Check password
    if not user.check_password(password):
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Generate tokens
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "role": role,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def user_register(request):
    """
    User registration endpoint - creates new user
    """
    username = request.data.get("username") or request.data.get("email", "").split("@")[0]
    email = request.data.get("email")
    password = request.data.get("password")
    first_name = request.data.get("first_name", "")
    last_name = request.data.get("last_name", "")
    role = request.data.get("role", "buyer")

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if email already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already registered"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if username already exists
    if User.objects.filter(username=username).exists():
        username = f"{username}_{User.objects.count()}"

    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )

    # Generate tokens
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "role": role,
        },
        status=status.HTTP_201_CREATED,
    )
