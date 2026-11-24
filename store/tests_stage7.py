from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from store.models import Product, Cart, Order, OrderStatusHistory, Prescription

class Stage7CheckoutTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='stage7user', password='password123')
        self.client.force_authenticate(user=self.user)
        self.product = Product.objects.create(
            name="Stage 7 Test Glasses",
            brand="Titan Eye+",
            category="eyeglasses",
            price=1200.0,
            discount_percentage=10.0,
            stock_quantity=10,
            frame_shape="rectangle",
            frame_size="medium",
            frame_color="black"
        )

    def test_checkout_cod_delivery_success(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'delivery_type': 'DELIVERY',
            'payment_method': 'COD'
        })
        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(id=response.data['order_id'])
        self.assertEqual(order.payment_method, 'COD')
        self.assertEqual(order.payment_status, 'UNPAID')
        self.assertEqual(order.delivery_type, 'DELIVERY')
        self.assertTrue(order.status_history.exists())

    def test_checkout_upi_with_utr(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'payment_method': 'UPI',
            'utr_number': '123456789012'
        })
        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(id=response.data['order_id'])
        self.assertEqual(order.payment_method, 'UPI')
        self.assertEqual(order.payment_status, 'PENDING_VERIFICATION')
        self.assertEqual(order.utr_number, '123456789012')

    def test_checkout_upi_missing_utr_fails(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'payment_method': 'UPI',
            'utr_number': ''
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('UTR', response.data['error'])

    def test_checkout_store_pickup(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.post('/api/checkout/', {
            'mobile': '7485067874',
            'delivery_type': 'PICKUP',
            'payment_method': 'COD'
        })
        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(id=response.data['order_id'])
        self.assertEqual(order.delivery_type, 'PICKUP')
        self.assertEqual(order.delivery_charge, 0.0)
        self.assertIn('Shop 4, Sheetal Tower', order.address)

    def test_manual_prescription_validation_invalid_step(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'prescription_option': 'manual',
            'od_sph': '1.33'  # Not 0.25 step
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('0.25', response.data['error'])

    def test_manual_prescription_cyl_requires_axis(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'prescription_option': 'manual',
            'od_sph': '-1.50',
            'od_cyl': '-0.75',
            'od_axis': '0'  # Invalid when CYL is non-zero
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('AXIS', response.data['error'])

    def test_manual_prescription_valid_creation(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874',
            'prescription_option': 'manual',
            'od_sph': '-2.25',
            'od_cyl': '-0.50',
            'od_axis': '90',
            'od_add': '1.25',
            'os_sph': '-2.00',
            'os_cyl': '0.00',
            'os_axis': '0',
            'os_add': '1.25',
            'pd': '64'
        })
        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(id=response.data['order_id'])
        self.assertIsNotNone(order.prescription)
        self.assertEqual(order.prescription.od_sph, -2.25)
        self.assertEqual(order.prescription.od_axis, 90)
        self.assertEqual(order.prescription.pd, 64.0)

