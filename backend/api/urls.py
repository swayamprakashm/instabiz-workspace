from django.urls import path
from .views import generate_storefront, create_subscription, generate_ad_banner

urlpatterns = [
    path('generate/', generate_storefront, name='generate_storefront'),
    path('subscribe/', create_subscription, name='create_subscription'),
    path('generate-ad/', generate_ad_banner, name='generate_ad_banner'),
]