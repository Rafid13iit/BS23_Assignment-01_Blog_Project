from django.contrib import admin
from django.urls import path, include
from users.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("user/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    # path("users/", include("users.urls")),
]