from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer, VerifyUserSerializer, UserLoginSerializer, UserDashboardSerializer
from .utils import send_otp_via_email
from rest_framework_simplejwt.tokens import RefreshToken

# Generate token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterAPI(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            data = request.data
            serializer = UserSerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                token = get_tokens_for_user(serializer.instance)
                send_otp_via_email(serializer.data['email'])
                return Response({
                    "token": token,
                    "status": "200",
                    "message": "User registered successfully, check mail please",
                    "data": serializer.data
                })
            return Response({
                "status": "400",
                "message": "User registration failed",
                "data": serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({
                "status": "500",
                "message": "Internal Server Error",
                "data": {}
            })
        
class VerifyOTP(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            data = request.data
            serializer = VerifyUserSerializer(data = data)
            
            if serializer.is_valid():
                email = serializer.data['email']
                otp = serializer.data['email_otp']
                user = CustomUser.objects.get(email = email)
                if user.email_otp == otp:
                    user.is_email_verified = True
                    user.save()
                    return Response({
                        "status": "200",
                        "message": "User verified successfully",
                        "data": {}
                    })
                return Response({
                    "status": "400",
                    "message": "User verification failed",
                    "data": {}
                })
            return Response({
                "status": "400",
                "message": "User verification failed",
                "data": serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({
                "status": "500",
                "message": "Internal Server Error",
                "data": {}
            })

class LoginAPI(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            data = request.data
            serializer = UserLoginSerializer(data = data)
            if serializer.is_valid():
                email = serializer.data['email']
                password = serializer.data['password']
                user = authenticate(email=email, password=password)
                if user is not None and user.is_email_verified:
                    token = get_tokens_for_user(user)
                    return Response({
                        "token": token,
                        "status": "200",
                        "message": "User login successfully",
                        "data": {}  
                    })

                else:
                    return Response({
                        "status": "400",
                        "message": "User login failed",
                        "data": {}
                    })
                
            return Response({
                "status": "400",
                "message": "User login failed",
                "data": serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({
                "status": "500",
                "message": "Internal Server Error",
                "data": {}
            })
        
class UserDashboardAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            serializer = UserDashboardSerializer(user)
            return Response({
                "status": "200",
                "message": "User dashboard",
                "data": serializer.data
            })
        except Exception as e:
            print(e)
            return Response({
                "status": "500",
                "message": "Internal Server Error",
                "data": {}
            }) 