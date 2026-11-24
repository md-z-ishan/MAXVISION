import io
from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from store.models import Order, Product

class Stage9SecurityAndProductionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='customer1', password='Password123!')
        self.user2 = User.objects.create_user(username='customer2', password='Password123!')
        self.staff_user = User.objects.create_user(username='staffuser', password='Password123!', is_staff=True)

    def test_health_check_endpoint(self):
        res = self.client.get('/api/health/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'ok')
        self.assertEqual(res.data['database'], 'connected')

    def test_authenticated_prescription_download_permissions(self):
        order = Order.objects.create(
            user=self.user1,
            total_amount=1200.0,
            mobile='7485067874',
            address='Ranchi Test',
            status='Pending',
            payment_status='PENDING'
        )
        # Create a dummy prescription file
        order.prescription_file.save('rx.pdf', SimpleUploadedFile('rx.pdf', b'%PDF-1.4 test dummy content'))
        order.save()

        # Anonymous cannot access
        self.client.force_authenticate(user=None)
        res_anon = self.client.get(f'/api/orders/{order.pk}/prescription/')
        self.assertEqual(res_anon.status_code, status.HTTP_401_UNAUTHORIZED)

        # Other customer cannot access
        self.client.force_authenticate(user=self.user2)
        res_other = self.client.get(f'/api/orders/{order.pk}/prescription/')
        self.assertEqual(res_other.status_code, status.HTTP_403_FORBIDDEN)

        # Order owner CAN access
        self.client.force_authenticate(user=self.user1)
        res_owner = self.client.get(f'/api/orders/{order.pk}/prescription/')
        self.assertEqual(res_owner.status_code, status.HTTP_200_OK)

        # Staff CAN access
        self.client.force_authenticate(user=self.staff_user)
        res_staff = self.client.get(f'/api/orders/{order.pk}/prescription/')
        self.assertEqual(res_staff.status_code, status.HTTP_200_OK)

    def test_prescription_upload_validation_rejects_disallowed_types(self):
        self.client.force_authenticate(user=self.user1)
        # Attempt to checkout with malicious or disallowed file extension (.exe)
        bad_file = SimpleUploadedFile('script.exe', b'malicious_payload', content_type='application/x-msdownload')
        res = self.client.post('/api/checkout/', {
            'address': 'Main Road Ranchi',
            'mobile': '7485067874',
            'prescription_option': 'upload',
            'prescription_file': bad_file
        }, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('PDF, JPG, or PNG', res.data.get('error', ''))
