from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer, VerifyUserSerializer, UserLoginSerializer, UserDashboardSerializer, UserChangePasswordSerializer
from .utils import send_otp_via_email
from rest_framework_simplejwt.tokens import RefreshToken

# Generate token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
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

from rest_framework import status

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.data
            serializer = UserLoginSerializer(data=data)

            if serializer.is_valid():
                email = serializer.validated_data['email']
                password = serializer.validated_data['password']
                user = authenticate(email=email, password=password)

                if user is not None:
                    if user.is_email_verified:
                        token = get_tokens_for_user(user)
                        return Response({
                            "token": token,
                            "status": "200",
                            "message": "User login successful",
                            "data": {}
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            "status": "403",
                            "message": "Please verify your email before logging in.",
                            "data": {}
                        }, status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response({
                        "status": "401",
                        "message": "Invalid email or password.",
                        "data": {}
                    }, status=status.HTTP_401_UNAUTHORIZED)

            return Response({
                "status": "400",
                "message": "Invalid input",
                "data": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({
                "status": "500",
                "message": "Internal Server Error",
                "data": {}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
class UserDashboardView(APIView):
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
        
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            serializer = UserChangePasswordSerializer(data = request.data, context = {'user': request.user})
            serializer.is_valid(raise_exception=True)
            return Response({
                "status": "200",
                "message": "Password changed successfully",
                "data": {}
            })
        except Exception as e:
            print(e)
            return Response({
                "status": "500",
                "message": "Internal Server Error",
                "data": {}
            })
        
        
class IsAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "success": True,
            "message": "User is authenticated"
        })
    

