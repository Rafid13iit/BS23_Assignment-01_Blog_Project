from django.contrib import admin
from django.urls import path, include
from blogs.views import ContactFormView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("users/", include("users.urls")),
    path("blogs/", include("blogs.urls")),
    path("contact/", ContactFormView.as_view(), name="contact-form"),

]