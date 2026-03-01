from django.contrib import admin

from .models import Invoice, Payment, Property, Tenant


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "status", "price", "city", "state")
    search_fields = ("name", "address", "city", "state")
    list_filter = ("status",)


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "property", "monthly_rent")
    search_fields = ("name", "email", "phone")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "tenant", "property", "amount", "status", "due_date")
    list_filter = ("status",)


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "tenant", "property", "amount", "issue_date", "due_date")
