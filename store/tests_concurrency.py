from django.test import TestCase
from django.contrib.auth.models import User
from django.db.models import F
from rest_framework.test import APIClient
from rest_framework import status
from store.models import Product, Order, Cart

class ConcurrencyStockAtomicTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='buyer1', password='Password123!')
        self.user2 = User.objects.create_user(username='buyer2', password='Password123!')
        
        # Product with only 1 item in stock
        self.product = Product.objects.create(
            name='Limited Titanium Aviator',
            category='eyeglasses',
            price=2500.0,
            stock_quantity=1
        )

    def test_atomic_conditional_stock_deduction(self):
        """Test conditional update: Product.objects.filter(pk=..., stock_quantity__gte=qty).update(stock_quantity=F('stock_quantity') - qty)"""
        # First deduction succeeds
        rows_updated1 = Product.objects.filter(pk=self.product.pk, stock_quantity__gte=1).update(
            stock_quantity=F('stock_quantity') - 1
        )
        self.assertEqual(rows_updated1, 1)

        # Second deduction fails because stock is now 0
        rows_updated2 = Product.objects.filter(pk=self.product.pk, stock_quantity__gte=1).update(
            stock_quantity=F('stock_quantity') - 1
        )
        self.assertEqual(rows_updated2, 0)

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 0)

    def test_last_stock_checkout_and_insufficient_stock_rejection(self):
        """First user successfully buys last item, second user gets 400 with atomic rollback."""
        # Setup cart for user 1
        Cart.objects.create(user=self.user1, product=self.product, quantity=1)
        # Setup cart for user 2
        Cart.objects.create(user=self.user2, product=self.product, quantity=1)

        client1 = APIClient()
        client1.force_authenticate(user=self.user1)
        res1 = client1.post('/api/checkout/', {
            'address': 'Main Road Ranchi',
            'mobile': '7485067874',
            'payment_method': 'COD'
        }, format='json')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 0)

        # User 2 attempts checkout for now out-of-stock product
        client2 = APIClient()
        client2.force_authenticate(user=self.user2)
        res2 = client2.post('/api/checkout/', {
            'address': 'Kanke Road Ranchi',
            'mobile': '7033353140',
            'payment_method': 'COD'
        }, format='json')
        self.assertEqual(res2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('insufficient stock', res2.data.get('error', '').lower())

        # Stock remains 0 (never negative)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 0)

        # Only 1 order created in DB
        self.assertEqual(Order.objects.count(), 1)

    def test_cancel_order_restores_stock_exactly_once(self):
        """Verify that cancelling an order restores stock once, and repeated cancellation does not restore duplicate stock."""
        Cart.objects.create(user=self.user1, product=self.product, quantity=1)

        client = APIClient()
        client.force_authenticate(user=self.user1)
        res = client.post('/api/checkout/', {
            'address': 'Main Road Ranchi',
            'mobile': '7485067874',
            'payment_method': 'COD'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 0)

        order = Order.objects.first()
        self.assertFalse(order.stock_restored)

        # First cancellation: stock should be restored
        order.status = 'Cancelled'
        order.save()

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 1)
        order.refresh_from_db()
        self.assertTrue(order.stock_restored)

        # Second cancellation / save: stock must NOT increase again
        order.status = 'Cancelled'
        order.save()

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 1)
