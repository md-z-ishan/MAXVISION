from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.test import APIClient
from rest_framework import status
from store.models import Address, UserProfile, Order, Product

class Stage8BShopOperationsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='customer1',
            email='cust1@example.com',
            password='Password123!',
            first_name='Aarav',
            last_name='Sharma'
        )
        self.user2 = User.objects.create_user(
            username='customer2',
            email='cust2@example.com',
            password='Password123!',
            first_name='Rohan',
            last_name='Verma'
        )
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='Password123!',
            is_staff=True
        )

    def test_mobile_number_validation_in_registration(self):
        # Invalid mobile: doesn't start with 6-9 or wrong length
        res = self.client.post('/api/auth/register/', {
            'username': 'newuser1',
            'password': 'Password123!',
            'mobile': '1234567890'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('valid 10-digit Indian mobile', res.data.get('error', ''))

        # Valid mobile
        res2 = self.client.post('/api/auth/register/', {
            'username': 'validuser',
            'password': 'Password123!',
            'mobile': '7485067874'
        }, format='json')
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)
        self.assertTrue(UserProfile.objects.filter(mobile='7485067874').exists())

    def test_user_profile_get_and_patch(self):
        self.client.force_authenticate(user=self.user1)
        
        # GET profile
        res = self.client.get('/api/auth/profile/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['first_name'], 'Aarav')

        # PATCH profile
        res_patch = self.client.patch('/api/auth/profile/', {
            'first_name': 'Aarav Updated',
            'mobile': '9876543210'
        }, format='json')
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(res_patch.data['first_name'], 'Aarav Updated')
        self.assertEqual(res_patch.data['mobile'], '9876543210')

    def test_address_crud_and_isolation(self):
        # Create address for user1
        self.client.force_authenticate(user=self.user1)
        res_create = self.client.post('/api/addresses/', {
            'full_name': 'Aarav Home',
            'mobile': '7485067874',
            'street_address': 'Shop 4, Sheetal Tower',
            'city': 'Ranchi',
            'state': 'Jharkhand',
            'pincode': '834001',
            'is_default': True
        }, format='json')
        self.assertEqual(res_create.status_code, status.HTTP_201_CREATED)
        addr_id = res_create.data['id']

        # User2 should not see user1's address
        self.client.force_authenticate(user=self.user2)
        res_user2 = self.client.get('/api/addresses/')
        self.assertEqual(len(res_user2.data), 0)

        # User2 cannot patch or delete user1's address
        res_hack = self.client.patch(f'/api/addresses/{addr_id}/', {'city': 'Patna'}, format='json')
        self.assertEqual(res_hack.status_code, status.HTTP_404_NOT_FOUND)

    def test_password_reset_flow(self):
        # Request reset token
        res = self.client.post('/api/auth/password-reset/', {
            'email': 'cust1@example.com'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Generate real token to confirm
        token = default_token_generator.make_token(self.user1)
        uid = urlsafe_base64_encode(force_bytes(self.user1.pk))

        # Reset with short password -> fail
        res_fail = self.client.post('/api/auth/password-reset/confirm/', {
            'uid': uid,
            'token': token,
            'new_password': '123'
        }, format='json')
        self.assertEqual(res_fail.status_code, status.HTTP_400_BAD_REQUEST)

        # Reset with valid password -> success
        res_ok = self.client.post('/api/auth/password-reset/confirm/', {
            'uid': uid,
            'token': token,
            'new_password': 'NewSecurePassword123!'
        }, format='json')
        self.assertEqual(res_ok.status_code, status.HTTP_200_OK)

        # User can authenticate with new password
        self.user1.refresh_from_db()
        self.assertTrue(self.user1.check_password('NewSecurePassword123!'))

    def test_admin_dashboard_stats_permission(self):
        # Non-staff denied
        self.client.force_authenticate(user=self.user1)
        res_denied = self.client.get('/api/admin/dashboard-stats/')
        self.assertEqual(res_denied.status_code, status.HTTP_403_FORBIDDEN)

        # Staff user allowed
        self.client.force_authenticate(user=self.staff_user)
        res_staff = self.client.get('/api/admin/dashboard-stats/')
        self.assertEqual(res_staff.status_code, status.HTTP_200_OK)
        self.assertIn('total_orders', res_staff.data)
        self.assertIn('low_stock_products', res_staff.data)
