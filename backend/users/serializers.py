from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.HyperlinkedModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password', 'password2'] 
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    # Validating Password and Confirm Password while Registration
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match!!")
        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class VerifyUserSerializer(serializers.HyperlinkedModelSerializer):
    email = serializers.EmailField()
    email_otp = serializers.CharField(max_length=6)
    class Meta:
        model = CustomUser
        fields = ['email', 'email_otp']
        extra_kwargs = {'email_otp': {'write_only': True, 'required': True}}
    

class UserLoginSerializer(serializers.HyperlinkedModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    class Meta:
        model = CustomUser
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

class UserDashboardSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email',]

class UserChangePasswordSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    class Meta:
        model = CustomUser
        fields = ['password', 'password2']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def validate (self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match!!")
        user.set_password(password)
        user.save()
        return attrs