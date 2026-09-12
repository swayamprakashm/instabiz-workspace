import base64
import json
import logging
import os
import re

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from google import genai
from google.genai import types

from .models import BusinessStore, MarketingSubscription

logger = logging.getLogger(__name__)

_client = None

def _get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Add it to backend/.env and restart the server."
            )
        _client = genai.Client(api_key=api_key)
    return _client

_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)

def _extract_json(raw_text: str) -> dict:
    cleaned = _FENCE_RE.sub("", raw_text).strip()
    return json.loads(cleaned)

@csrf_exempt
@require_http_methods(["POST"])
def generate_storefront(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

    business_name = (payload.get("businessName") or "").strip()
    industry = (payload.get("industry") or "").strip()
    description = (payload.get("description") or "").strip()

    theme = (payload.get("themeOption") or "Modern").strip()
    color = (payload.get("colorOption") or "Indigo").strip()
    font = (payload.get("fontOption") or "Sans-Serif").strip()
    hero = (payload.get("heroFeature") or "Large Image").strip()
    ui_style = (payload.get("uiOption") or "Minimalist").strip()

    system_prompt = f"""You are an expert web developer and branding agent.
Create a landing page for a business named '{business_name}' in the '{industry}' industry.
Description: {description}

DESIGN SPECIFICATIONS:
- Theme: {theme}
- Primary Brand Color: {color}
- Typography/Font: {font}
- Hero Section Feature: {hero}
- Overall UI Style: {ui_style}

Respond ONLY with a raw JSON object matching this exact schema:
{{
    "tagline": "A catchy 4-5 word slogan",
    "primary_color": "A hex color code matching {color}",
    "html_template": "<div class='min-h-screen bg-gray-50'>...Tailwind HTML content...</div>"
}}"""

    try:
        client = _get_client()
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=system_prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="application/json",
            ),
        )
        ai_data = _extract_json(response.text)
    except Exception as exc:
        logger.exception("Storefront generation failed")
        return JsonResponse({"status": "error", "message": str(exc)}, status=502)

    store = BusinessStore.objects.create(
        business_name=business_name,
        industry=industry,
        description=description,
        primary_color=ai_data.get("primary_color"),
        generated_tagline=ai_data.get("tagline"),
        generated_html=ai_data.get("html_template"),
    )

    return JsonResponse({"status": "success", "store_id": str(store.id), "data": ai_data}, status=200)

@csrf_exempt
@require_http_methods(["POST"])
def create_subscription(request):
    try:
        payload = json.loads(request.body or "{}")
        store_id = payload.get("store_id")
        frequency = payload.get("frequency")
        duration_months = int(payload.get("duration_months", 3))

        store = BusinessStore.objects.get(id=store_id)
        base_rates = {'daily': 45, 'every_3_days': 20, 'weekly': 10}
        total_cost = base_rates.get(frequency, 20) * duration_months

        subscription = MarketingSubscription.objects.create(
            business=store, frequency=frequency, duration_months=duration_months, total_cost=total_cost
        )
        return JsonResponse({"status": "success", "subscription_id": str(subscription.id), "total_cost": float(total_cost)}, status=201)
    except Exception as exc:
        return JsonResponse({"status": "error", "message": str(exc)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def generate_ad_banner(request):
    try:
        store_id = None
        business_name = "Local Business"
        industry = "Retail"
        brand_color = "#4F46E5"
        selected_theme = "Festive"
        product_details = ""
        product_image = None
        image_data_uri = None

        # Handle multipart/form-data (FormData containing text fields and optional image)
        if request.content_type and 'multipart/form-data' in request.content_type:
            store_id = request.POST.get("store_id")
            business_name = (request.POST.get("business_name") or "Local Business").strip()
            industry = (request.POST.get("industry") or "Retail").strip()
            brand_color = (request.POST.get("brand_color") or "#4F46E5").strip()
            selected_theme = (request.POST.get("theme") or "Festive").strip()
            product_details = (request.POST.get("product_details") or "").strip()
            product_image = request.FILES.get("product_image", None)

            if product_image:
                img_bytes = product_image.read()
                encoded_img = base64.b64encode(img_bytes).decode('utf-8')
                content_type = product_image.content_type or 'image/jpeg'
                image_data_uri = f"data:{content_type};base64,{encoded_img}"
        else:
            payload = json.loads(request.body.decode('utf-8') or "{}")
            store_id = payload.get("store_id")
            business_name = (payload.get("business_name") or "Local Business").strip()
            industry = (payload.get("industry") or "Retail").strip()
            brand_color = (payload.get("brand_color") or "#4F46E5").strip()
            selected_theme = (payload.get("theme") or "Festive").strip()
            product_details = (payload.get("product_details") or "").strip()

        if not product_details:
            return JsonResponse({"status": "error", "message": "product_details is required."}, status=400)

        # Get or create store record
        if store_id:
            try:
                store = BusinessStore.objects.get(id=store_id)
            except BusinessStore.DoesNotExist:
                store = BusinessStore.objects.create(
                    business_name=business_name, industry=industry, description="Auto-generated Ad Platform", primary_color=brand_color
                )
                store_id = str(store.id)
        else:
            store = BusinessStore.objects.create(
                business_name=business_name, industry=industry, description="Auto-generated Ad Platform", primary_color=brand_color
            )
            store_id = str(store.id)

        # FAST AI INSTRUCTION: Use a placeholder instead of the massive Base64 string
        image_instruction = ""
        if image_data_uri:
            image_instruction = f"""
            - An actual product image has been provided! You MUST embed it cleanly inside an HTML <img> tag using EXACTLY this src: 'PRODUCT_IMAGE_PLACEHOLDER'.
            - Give the <img> tag professional styling (e.g., rounded-xl object-cover w-36 h-36 shadow-lg border-2 border-white/25) so it stands out prominently.
            """
        else:
            image_instruction = "- No product image provided. Use a clean typographic badge or icon element instead."

        system_prompt = f"""You are an expert digital marketer and creative designer.
Create a highly engaging, standalone HTML/Tailwind CSS ad banner for a business named '{business_name}'.

- Product/Offer Details: {product_details}
- Brand Primary Color: {brand_color}
- Industry: {industry}
- Campaign Vibe / Theme: {selected_theme} (Adapt the background gradients, accents, and typography to match this vibe e.g. Festive, Ritual, Party, Casual, or Minimalist)
{image_instruction}

Requirements:
1. Dimensions should visually fit a standard rectangular ad layout with rich padding.
2. Use Tailwind CSS via inline classes.
3. Match the theme vibe and brand color ({brand_color}) brilliantly.
4. Include a strong Call to Action (CTA) button.

Respond ONLY with a raw JSON object matching this exact schema:
{{
    "html_banner": "<div class='...'>...Tailwind HTML banner...</div>"
}}"""

        client = _get_client()
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=system_prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="application/json",
            ),
        )

        ai_data = _extract_json(response.text)
        
        # EXTRACT HTML
        html_banner = ai_data.get("html_banner", "")

        # INSTANT PYTHON REPLACEMENT: Swap the placeholder with the real image data!
        if image_data_uri:
            html_banner = html_banner.replace("PRODUCT_IMAGE_PLACEHOLDER", image_data_uri)

        return JsonResponse({
            "status": "success",
            "html_banner": html_banner,
            "store_id": store_id
        }, status=200)

    except Exception as exc:
        logger.exception("Ad generation failed")
        return JsonResponse({"status": "error", "message": f"Ad generation failed: {exc}"}, status=502)