from django.contrib import admin
from django.urls import path, include
from blogs.views import ContactFormView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("users/", include("users.urls")),
    path("blogs/", include("blogs.urls")),
    path("contact/", ContactFormView.as_view(), name="contact-form"),

]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)