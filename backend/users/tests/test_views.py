from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from users.models import CustomUser
import json
from unittest.mock import patch


class RegisterViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.valid_payload = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
            'password2': 'testpassword'
        }

    @patch('users.views.send_otp_via_email')
    def test_register_user(self, mock_send_otp):
        mock_send_otp.return_value = None
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], '200')
        self.assertEqual(response.data['message'], 'User registered successfully, check mail please')
        self.assertEqual(CustomUser.objects.count(), 1)
        
        user = CustomUser.objects.get()
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'testuser@example.com')
        self.assertFalse(user.is_email_verified)
        
        # Checking that OTP email was sent
        mock_send_otp.assert_called_once_with('testuser@example.com')

    def test_register_user_passwords_not_matching(self):
        invalid_payload = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
            'password2': 'wrongpassword'
        }
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(invalid_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], '400')
        self.assertEqual(response.data['message'], 'User registration failed')
        self.assertEqual(CustomUser.objects.count(), 0)


class VerifyOTPTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Creating a user with an OTP
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.user.email_otp = '123456'
        self.user.save()
        
        self.verify_url = reverse('verify')
        self.valid_payload = {
            'email': 'testuser@example.com',
            'email_otp': '123456'
        }

    def test_verify_otp_valid(self):
        response = self.client.post(
            self.verify_url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], '200')
        self.assertEqual(response.data['message'], 'User verified successfully')
        
        # Checking that user is now verified
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_email_verified)

    def test_verify_otp_invalid(self):
        invalid_payload = {
            'email': 'testuser@example.com',
            'email_otp': '654321'  # Wrong OTP
        }
        
        response = self.client.post(
            self.verify_url,
            data=json.dumps(invalid_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], '400')
        self.assertEqual(response.data['message'], 'User verification failed')
        
        # Checking that user is still not verified
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_email_verified)


class LoginViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Creating a verified user
        self.verified_user = CustomUser.objects.create_user(
            username='verifieduser',
            email='verified@example.com',
            password='testpassword'
        )
        self.verified_user.is_email_verified = True
        self.verified_user.save()
        
        # Creating an unverified user
        self.unverified_user = CustomUser.objects.create_user(
            username='unverifieduser',
            email='unverified@example.com',
            password='testpassword'
        )
        
        self.login_url = reverse('login')

    def test_login_verified_user(self):
        payload = {
            'email': 'verified@example.com',
            'password': 'testpassword'
        }
        
        response = self.client.post(
            self.login_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], '200')
        self.assertEqual(response.data['message'], 'User login successful')
        self.assertIn('token', response.data)
        self.assertIn('access', response.data['token'])
        self.assertIn('refresh', response.data['token'])

    def test_login_unverified_user(self):
        payload = {
            'email': 'unverified@example.com',
            'password': 'testpassword'
        }
        
        response = self.client.post(
            self.login_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['status'], '403')
        self.assertEqual(response.data['message'], 'Please verify your email before logging in.')

    def test_login_invalid_credentials(self):
        payload = {
            'email': 'verified@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(
            self.login_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['status'], '401')
        self.assertEqual(response.data['message'], 'Invalid email or password.')


class UserDashboardViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        
        self.dashboard_url = reverse('user')

    def test_dashboard_authenticated(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get(self.dashboard_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], '200')
        self.assertEqual(response.data['message'], 'User dashboard')
        self.assertEqual(response.data['data']['username'], 'testuser')
        self.assertEqual(response.data['data']['email'], 'testuser@example.com')

    def test_dashboard_unauthenticated(self):
        response = self.client.get(self.dashboard_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class IsAuthViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        
        self.auth_check_url = reverse('is-auth')

    def test_is_auth_authenticated(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get(self.auth_check_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['message'], 'User is authenticated')

    def test_is_auth_unauthenticated(self):
        response = self.client.get(self.auth_check_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)