from django.urls import path
# from .views import CreateUserView
from .views import RegisterAPI, VerifyOTP, LoginAPI
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


urlpatterns = [
    # path("register/", CreateUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="verify"),
    path("register/", RegisterAPI.as_view(), name="register"),
    path("verify/", VerifyOTP.as_view(), name="verify"),
    path("login/", LoginAPI.as_view(), name="login"),
]