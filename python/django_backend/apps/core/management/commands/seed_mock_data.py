from datetime import date
from pathlib import Path
import sys

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

PYTHON_DIR = Path(__file__).resolve().parents[5]
if str(PYTHON_DIR) not in sys.path:
    sys.path.insert(0, str(PYTHON_DIR))

from data.mock_data import MOCK_INVOICES, MOCK_PAYMENTS, MOCK_PROPERTIES, MOCK_TENANTS
from apps.core.models import Invoice, Payment, Property, Tenant


class Command(BaseCommand):
    help = "Seed database with existing mock data for frontend compatibility"

    def handle(self, *args, **options):
        # Create test users
        self.create_test_users()
        
        # Seed properties, tenants, payments, invoices
        Invoice.objects.all().delete()
        Payment.objects.all().delete()
        Tenant.objects.all().delete()
        Property.objects.all().delete()

        property_map = {}
        for payload in MOCK_PROPERTIES:
            pk = int(payload["id"])
            city = payload.get("city") or ""
            state = payload.get("state") or ""
            zip_code = payload.get("zip_code") or ""
            if not (city and state and zip_code):
                address_chunks = [part.strip() for part in payload.get("address", "").split(",")]
                if len(address_chunks) >= 3:
                    city = city or address_chunks[-2]
                    state_zip = address_chunks[-1].split()
                    if state_zip:
                        state = state or state_zip[0]
                        if len(state_zip) > 1:
                            zip_code = zip_code or state_zip[-1]

            instance = Property.objects.create(
                id=pk,
                name=payload["name"],
                description=payload.get("description", ""),
                property_type=payload.get("type", ""),
                location=payload.get("location", ""),
                address=payload["address"],
                city=city,
                state=state,
                zip_code=zip_code,
                price=payload["price"],
                size=payload.get("size"),
                bedrooms=payload.get("bedrooms"),
                bathrooms=payload.get("bathrooms"),
                year_built=payload.get("year_built"),
                status=payload.get("status", Property.STATUS_AVAILABLE),
                amenities=payload.get("amenities", []),
                lat=payload.get("lat"),
                lng=payload.get("lng"),
            )
            property_map[payload["id"]] = instance

        tenant_map = {}
        for payload in MOCK_TENANTS:
            pk = int(payload["id"])
            instance = Tenant.objects.create(
                id=pk,
                name=payload["name"],
                email=payload["email"],
                phone=payload["phone"],
                property=property_map.get(payload.get("property_id")),
                lease_start_date=payload.get("lease_start_date"),
                lease_end_date=payload.get("lease_end_date"),
                monthly_rent=payload.get("monthly_rent", 0),
            )
            tenant_map[payload["id"]] = instance

        payment_map = {}
        for payload in MOCK_PAYMENTS:
            paid_date = payload.get("paid_date")
            if paid_date is None:
                paid_date = None
            instance = Payment.objects.create(
                id=payload["id"],
                tenant=tenant_map[payload["tenant_id"]],
                property=property_map[payload["property_id"]],
                amount=payload["amount"],
                due_date=payload["due_date"],
                paid_date=paid_date,
                status=payload.get("status", Payment.STATUS_PENDING),
            )
            payment_map[payload["id"]] = instance

        for payload in MOCK_INVOICES:
            Invoice.objects.create(
                id=payload["id"],
                payment=payment_map[payload["payment_id"]],
                tenant=tenant_map[payload["tenant_id"]],
                property=property_map[payload["property_id"]],
                amount=payload["amount"],
                issue_date=payload["issue_date"],
                due_date=payload["due_date"],
                description=payload.get("description", ""),
                generated_at=payload.get("generated_at", date.today()),
            )

        self.stdout.write(self.style.SUCCESS("Mock data seeded successfully."))

    def create_test_users(self):
        """Create test users for development"""
        test_users = [
            {"username": "admin", "email": "admin@example.com", "password": "password", "first_name": "Admin", "last_name": "User", "is_staff": True, "is_superuser": True},
            {"username": "seller", "email": "seller@example.com", "password": "password", "first_name": "Seller", "last_name": "User"},
            {"username": "buyer", "email": "buyer@example.com", "password": "password", "first_name": "Buyer", "last_name": "User"},
        ]

        for user_data in test_users:
            is_staff = user_data.pop("is_staff", False)
            is_superuser = user_data.pop("is_superuser", False)
            
            if not User.objects.filter(username=user_data["username"]).exists():
                user = User.objects.create_user(**user_data)
                user.is_staff = is_staff
                user.is_superuser = is_superuser
                user.save()
                self.stdout.write(f"Created user: {user_data['username']}")
            else:
                self.stdout.write(f"User already exists: {user_data['username']}")

