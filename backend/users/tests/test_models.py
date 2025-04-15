from django.test import TestCase
from users.models import CustomUser, CustomUserManager


class CustomUserManagerTest(TestCase):
    def test_create_user(self):
        user = CustomUser.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('testpassword'))
        self.assertFalse(user.is_admin)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_email_verified)

    def test_create_user_without_email(self):
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                email='',
                username='testuser',
                password='testpassword'
            )

    def test_create_user_without_username(self):
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                email='test@example.com',
                username='',
                password='testpassword'
            )

    def test_create_superuser(self):
        admin_user = CustomUser.objects.create_superuser(
            email='admin@example.com',
            username='adminuser',
            password='adminpassword'
        )
        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertEqual(admin_user.username, 'adminuser')
        self.assertTrue(admin_user.check_password('adminpassword'))
        self.assertTrue(admin_user.is_admin)
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)


class CustomUserModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a regular user for testing
        CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        # Create a superuser for testing
        CustomUser.objects.create_superuser(
            email='admin@example.com',
            username='adminuser',
            password='adminpassword'
        )

    def test_user_str_method(self):
        user = CustomUser.objects.get(email='testuser@example.com')
        self.assertEqual(str(user), 'testuser')

    def test_user_has_perm_method(self):
        user = CustomUser.objects.get(email='testuser@example.com')
        admin = CustomUser.objects.get(email='admin@example.com')
        
        self.assertFalse(user.has_perm('test_perm'))
        self.assertTrue(admin.has_perm('test_perm'))

    def test_user_has_module_perms_method(self):
        user = CustomUser.objects.get(email='testuser@example.com')
        admin = CustomUser.objects.get(email='admin@example.com')
        
        self.assertFalse(user.has_module_perms('test_app'))
        self.assertTrue(admin.has_module_perms('test_app'))