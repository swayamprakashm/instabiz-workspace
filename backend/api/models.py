import uuid

from django.db import models


class BusinessStore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    description = models.TextField()

    # AI-generated assets
    primary_color = models.CharField(max_length=10, blank=True, null=True)
    generated_tagline = models.CharField(max_length=255, blank=True, null=True)
    generated_html = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "api"
        ordering = ["-created_at"]

    def __str__(self):
        return self.business_name


class MarketingSubscription(models.Model):
    PLAN_FREQUENCIES = [
        ('daily', '1 Post Per Day'),
        ('every_3_days', '1 Post Per 3 Days'),
        ('weekly', '1 Post Per Week'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(BusinessStore, on_delete=models.CASCADE, related_name='subscriptions')
    frequency = models.CharField(max_length=50, choices=PLAN_FREQUENCIES)
    duration_months = models.IntegerField(choices=[(3, '3 Months'), (6, '6 Months'), (9, '9 Months')])
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "api"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.business.business_name} - {self.get_frequency_display()} ({self.duration_months} Months)"