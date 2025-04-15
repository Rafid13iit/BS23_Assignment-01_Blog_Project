from django.test import TestCase
from users.models import CustomUser
from users.serializers import (
    UserSerializer, 
    VerifyUserSerializer, 
    UserLoginSerializer, 
    UserDashboardSerializer,
    UserChangePasswordSerializer
)


class UserSerializerTest(TestCase):
    def test_user_serializer_validation_success(self):
        data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'testpassword',
            'password2': 'testpassword'
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_user_serializer_validation_password_mismatch(self):
        data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'testpassword',
            'password2': 'differentpassword'
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_user_serializer_create(self):
        data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'testpassword',
            'password2': 'testpassword'
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('testpassword'))


class VerifyUserSerializerTest(TestCase):
    def test_verify_user_serializer(self):
        data = {
            'email': 'test@example.com',
            'email_otp': '123456'
        }
        serializer = VerifyUserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.data['email'], 'test@example.com')


class UserLoginSerializerTest(TestCase):
    def test_user_login_serializer(self):
        data = {
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        serializer = UserLoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['email'], 'test@example.com')
        self.assertEqual(serializer.validated_data['password'], 'testpassword')


class UserDashboardSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test user
        cls.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )

    def test_user_dashboard_serializer(self):
        serializer = UserDashboardSerializer(self.user)
        self.assertEqual(set(serializer.data.keys()), {'id', 'username', 'email'})
        self.assertEqual(serializer.data['username'], 'testuser')
        self.assertEqual(serializer.data['email'], 'testuser@example.com')


class UserChangePasswordSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test user
        cls.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='oldpassword'
        )

    def test_change_password_serializer_valid(self):
        data = {
            'password': 'newpassword',
            'password2': 'newpassword'
        }
        context = {'user': self.user}
        serializer = UserChangePasswordSerializer(data=data, context=context)
        self.assertTrue(serializer.is_valid())
        serializer.validate(serializer.validated_data)
        
        # Refresh user from database
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword'))

    def test_change_password_serializer_mismatch(self):
        data = {
            'password': 'newpassword',
            'password2': 'differentpassword'
        }
        context = {'user': self.user}
        serializer = UserChangePasswordSerializer(data=data, context=context)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)