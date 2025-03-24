from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer
from .utils import send_otp_via_email


# class CreateUserView(generics.CreateAPIView):
#     queryset = CustomUser.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]

#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         send_otp_via_email(UserSerializer.data['email'])
#         return Response({
#             "status": "200",
#             "message": "User registered successfully, check mail please",
#             "data": response.data
#         })


class RegisterAPI(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            data = request.data
            serializer = UserSerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                send_otp_via_email(serializer.data['email'])
                return Response({
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
        
