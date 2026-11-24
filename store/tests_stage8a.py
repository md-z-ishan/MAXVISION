from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient
from store.models import Product, Cart, Order, Invoice, StorePaymentSettings, OrderStatusHistory
from store.utils import render_to_pdf, notify_shop

class Stage8APaymentTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='stage8user', password='password123')
        self.client.force_authenticate(user=self.user)
        self.product = Product.objects.create(
            name="Stage 8 Test Glasses",
            brand="Ray-Ban",
            category="eyeglasses",
            price=2500.0,
            discount_percentage=10.0,
            stock_quantity=10,
            frame_shape="round",
            frame_size="medium",
            frame_color="gold"
        )

    def test_payment_settings_api_disabled_by_default(self):
        # Settings without QR or with upi_enabled=False should return upi_enabled=False
        response = self.client.get('/api/payment-settings/')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data.get('upi_enabled'))

    def test_upi_utr_format_validation(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        # Less than 10 characters
        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'payment_method': 'UPI',
            'utr_number': '123'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('10 to 22', response.data['error'])

    def test_upi_duplicate_utr_rejected(self):
        # First order with UTR
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        res1 = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'payment_method': 'UPI',
            'utr_number': 'UTR1234567890'
        })
        self.assertEqual(res1.status_code, 201)

        # Second order attempting same UTR
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        res2 = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'payment_method': 'UPI',
            'utr_number': 'UTR1234567890'
        })
        self.assertEqual(res2.status_code, 400)
        self.assertIn('already been submitted', res2.data['error'])

    def test_invoice_creation_and_pdf_generation(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        res = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'payment_method': 'COD'
        })
        self.assertEqual(res.status_code, 201)
        order_id = res.data['order_id']
        order = Order.objects.get(id=order_id)

        # Verify Invoice record exists
        invoice = Invoice.objects.filter(order=order).first()
        self.assertIsNotNone(invoice)

        # Test Invoice Download API
        inv_res = self.client.get(f'/api/orders/{order_id}/invoice/')
        self.assertEqual(inv_res.status_code, 200)
        self.assertEqual(inv_res['Content-Type'], 'application/pdf')
        self.assertTrue(inv_res.content.startswith(b'%PDF'))

    def test_notify_shop_silent_fallback(self):
        order = Order.objects.create(
            user=self.user,
            address="Sheetal Tower, Ranchi",
            mobile="7485067874",
            total_amount=1500.0,
            status="Pending"
        )
        # notify_shop should complete cleanly without errors
        notify_shop(order)

