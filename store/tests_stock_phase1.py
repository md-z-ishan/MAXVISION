from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from store.models import Product, Cart, Order, OrderItem

class StockAndCheckoutTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        from store.api_views import CheckoutAPI
        cls._orig_throttle = getattr(CheckoutAPI, 'throttle_classes', None)
        CheckoutAPI.throttle_classes = ()

    @classmethod
    def tearDownClass(cls):
        from store.api_views import CheckoutAPI
        if cls._orig_throttle is not None:
            CheckoutAPI.throttle_classes = cls._orig_throttle
        elif hasattr(CheckoutAPI, 'throttle_classes'):
            delattr(CheckoutAPI, 'throttle_classes')
        super().tearDownClass()

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testcustomer', password='password123')
        self.client.force_authenticate(user=self.user)

        self.prod_a = Product.objects.create(
            name='Titan Titanium Edge',
            description='Premium titanium frame',
            price=2000.0,
            discount_percentage=10.0, # discounted price = 1800
            stock_quantity=5,
            category='eyeglasses'
        )

        self.prod_b = Product.objects.create(
            name='Ray-Ban Aviator Limited',
            description='Classic gold aviator',
            price=5000.0,
            discount_percentage=0.0, # discounted price = 5000
            stock_quantity=2,
            category='sunglasses'
        )

    def test_empty_cart_rejected(self):
        """Rule 5: Khali cart par checkout 400 de."""
        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '9876543210'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Cart is empty", response.data.get('error', ''))
        self.assertEqual(Order.objects.count(), 0)

    def test_stock_insufficient_order_fails(self):
        """Rule 8.1: stock kam ho to order fail."""
        # Requesting 4 when only 2 are in stock
        Cart.objects.create(user=self.user, product=self.prod_b, quantity=4)

        response = self.client.post('/api/checkout/', {
            'address': 'Sheetal Tower, Taxi Stand, Ranchi',
            'mobile': '7485067874'
        }, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Insufficient stock", response.data.get('error', ''))
        
        # Verify stock was NOT reduced
        self.prod_b.refresh_from_db()
        self.assertEqual(self.prod_b.stock_quantity, 2)
        self.assertEqual(Order.objects.count(), 0)
        # Cart must remain intact
        self.assertEqual(Cart.objects.filter(user=self.user).count(), 1)

    def test_order_deducts_stock_atomically(self):
        """Rule 8.2: order ke baad stock minus."""
        Cart.objects.create(user=self.user, product=self.prod_a, quantity=3)

        response = self.client.post('/api/checkout/', {
            'address': 'Sheetal Tower, Ranchi',
            'mobile': '7485067874'
        }, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.prod_a.refresh_from_db()
        # Stock: 5 - 3 = 2
        self.assertEqual(self.prod_a.stock_quantity, 2)
        
        # Order and item created
        self.assertEqual(Order.objects.count(), 1)
        order = Order.objects.first()
        self.assertEqual(order.status, 'Pending')
        self.assertFalse(order.stock_restored)
        # Cart cleared in same transaction
        self.assertEqual(Cart.objects.filter(user=self.user).count(), 0)

    def test_two_items_one_fails_full_rollback(self):
        """Rule 8.3: do items mein se ek fail ho to poora rollback."""
        # prod_a has 5 (we want 2 -> ok)
        Cart.objects.create(user=self.user, product=self.prod_a, quantity=2)
        # prod_b has 2 (we want 5 -> fails!)
        Cart.objects.create(user=self.user, product=self.prod_b, quantity=5)

        response = self.client.post('/api/checkout/', {
            'address': 'Main Road, Ranchi',
            'mobile': '7485067874'
        }, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Atomic rollback verification: prod_a stock MUST remain 5, prod_b MUST remain 2
        self.prod_a.refresh_from_db()
        self.prod_b.refresh_from_db()
        self.assertEqual(self.prod_a.stock_quantity, 5)
        self.assertEqual(self.prod_b.stock_quantity, 2)
        self.assertEqual(Order.objects.count(), 0)
        # Cart still has both items
        self.assertEqual(Cart.objects.filter(user=self.user).count(), 2)

    def test_cancel_restores_stock_exactly_once(self):
        """Rule 8.4: cancel par stock sirf ek baar wapas."""
        Cart.objects.create(user=self.user, product=self.prod_a, quantity=3)
        self.client.post('/api/checkout/', {
            'address': 'Sheetal Tower, Ranchi',
            'mobile': '7485067874'
        }, format='multipart')

        self.prod_a.refresh_from_db()
        self.assertEqual(self.prod_a.stock_quantity, 2) # 5 - 3 = 2

        order = Order.objects.first()
        self.assertFalse(order.stock_restored)

        # First cancellation: restores 3 back to stock -> 2 + 3 = 5
        order.status = 'Cancelled'
        order.save()

        self.prod_a.refresh_from_db()
        self.assertEqual(self.prod_a.stock_quantity, 5)
        
        order.refresh_from_db()
        self.assertTrue(order.stock_restored)

        # Second save (e.g. admin saves again while still Cancelled)
        order.address = 'Updated Address'
        order.save()

        self.prod_a.refresh_from_db()
        # Stock must STAY 5, NOT 8!
        self.assertEqual(self.prod_a.stock_quantity, 5)

    def test_price_tampering_ignored(self):
        """Rule 8.5: Total price server DB se nikalo, frontend ke amount par bharosa nahi."""
        # prod_a discounted price is 1800. Qty 2 -> Subtotal = 3600
        Cart.objects.create(user=self.user, product=self.prod_a, quantity=2)

        # Client attempts to send malicious total_amount=10
        response = self.client.post('/api/checkout/', {
            'address': 'Sheetal Tower, Ranchi',
            'mobile': '7485067874',
            'total_amount': '10.00' 
        }, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order = Order.objects.first()
        # Server computed price must be 3600.00, client value 10.00 ignored
        self.assertEqual(float(order.total_amount), 3600.0)

