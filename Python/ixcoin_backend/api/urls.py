from django.conf.urls import url, include
from rest_framework.schemas import get_schema_view
from rest_framework_swagger.renderers import SwaggerUIRenderer, OpenAPIRenderer

# Generate API Documentation over Swagger
schema_view = get_schema_view(title='Users API', renderer_classes=[OpenAPIRenderer, SwaggerUIRenderer])

urlpatterns = [
    url(r'^', include('ixcoin_backend.api.accounts.urls')),
    url(r'^', include('ixcoin_backend.api.community.urls')),
    url(r'^', schema_view, name="docs"),
]
