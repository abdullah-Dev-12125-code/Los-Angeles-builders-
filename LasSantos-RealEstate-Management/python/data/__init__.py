"""Data module for Los Santos Builders application."""

from .mock_data import (
    get_properties,
    get_property,
    get_tenants,
    get_tenant,
    get_payments,
    get_invoices,
    get_payment_stats,
    get_property_stats,
    get_revenue_trends,
)

__all__ = [
    "get_properties",
    "get_property",
    "get_tenants",
    "get_tenant",
    "get_payments",
    "get_invoices",
    "get_payment_stats",
    "get_property_stats",
    "get_revenue_trends",
]
