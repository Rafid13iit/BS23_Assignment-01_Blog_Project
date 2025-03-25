from django.urls import path
from .views import RegisterView, VerifyOTP, LoginView, UserDashboardView, ChangePasswordView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="verify"),
    path("register/", RegisterView.as_view(), name="register"),
    path("verify/", VerifyOTP.as_view(), name="verify"),
    path("login/", LoginView.as_view(), name="login"),
    path("dashboard/", UserDashboardView.as_view(), name="user"),
    path('changepassword/', ChangePasswordView.as_view(), name='changepassword'),
]  