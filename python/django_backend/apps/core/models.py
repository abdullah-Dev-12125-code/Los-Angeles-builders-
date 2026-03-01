from django.db import models


class Property(models.Model):
    STATUS_AVAILABLE = "available"
    STATUS_RENTED = "rented"
    STATUS_MAINTENANCE = "maintenance"
    STATUS_CHOICES = [
        (STATUS_AVAILABLE, "Available"),
        (STATUS_RENTED, "Rented"),
        (STATUS_MAINTENANCE, "Maintenance"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    property_type = models.CharField(max_length=64, blank=True)
    location = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=120, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    size = models.PositiveIntegerField(null=True, blank=True)
    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bathrooms = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    year_built = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)
    amenities = models.JSONField(default=list, blank=True)
    lat = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    lng = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return self.name


class Tenant(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=64)
    property = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, related_name="tenants")
    lease_start_date = models.DateField(null=True, blank=True)
    lease_end_date = models.DateField(null=True, blank=True)
    monthly_rent = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return self.name


class Payment(models.Model):
    STATUS_PAID = "paid"
    STATUS_PENDING = "pending"
    STATUS_OVERDUE = "overdue"
    STATUS_CHOICES = [
        (STATUS_PAID, "Paid"),
        (STATUS_PENDING, "Pending"),
        (STATUS_OVERDUE, "Overdue"),
    ]

    id = models.CharField(primary_key=True, max_length=40)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="payments")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)

    class Meta:
        ordering = ["due_date", "id"]

    def __str__(self) -> str:
        return self.id


class Invoice(models.Model):
    id = models.CharField(primary_key=True, max_length=40)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="invoices")
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="invoices")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="invoices")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    issue_date = models.DateField()
    due_date = models.DateField()
    description = models.TextField(blank=True)
    generated_at = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["issue_date", "id"]

    def __str__(self) -> str:
        return self.id
