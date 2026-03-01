from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Invoice, Payment, Property, Tenant


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "id",
            "name",
            "description",
            "property_type",
            "location",
            "address",
            "city",
            "state",
            "zip_code",
            "price",
            "size",
            "bedrooms",
            "bathrooms",
            "year_built",
            "status",
            "amenities",
            "lat",
            "lng",
        ]


class TenantSerializer(serializers.ModelSerializer):
    property_id = serializers.IntegerField(source="property.id", read_only=True)

    class Meta:
        model = Tenant
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "property",
            "property_id",
            "lease_start_date",
            "lease_end_date",
            "monthly_rent",
        ]


class PaymentSerializer(serializers.ModelSerializer):
    tenant_id = serializers.IntegerField(source="tenant.id", read_only=True)
    property_id = serializers.IntegerField(source="property.id", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "tenant",
            "tenant_id",
            "property",
            "property_id",
            "amount",
            "due_date",
            "paid_date",
            "status",
        ]


class InvoiceSerializer(serializers.ModelSerializer):
    tenant_id = serializers.IntegerField(source="tenant.id", read_only=True)
    property_id = serializers.IntegerField(source="property.id", read_only=True)
    payment_id = serializers.CharField(source="payment.id", read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "payment",
            "payment_id",
            "tenant",
            "tenant_id",
            "property",
            "property_id",
            "amount",
            "issue_date",
            "due_date",
            "description",
            "generated_at",
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff", "is_superuser"]
