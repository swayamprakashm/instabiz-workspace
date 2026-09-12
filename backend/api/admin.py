from django.contrib import admin

from .models import BusinessStore


@admin.register(BusinessStore)
class BusinessStoreAdmin(admin.ModelAdmin):
    list_display = ("business_name", "industry", "created_at")
    search_fields = ("business_name", "industry")
    readonly_fields = ("id", "created_at")
