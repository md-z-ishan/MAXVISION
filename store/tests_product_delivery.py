from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from store.models import Product, Cart, Address

class ProductDeliveryAndPincodeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testpincodeuser', password='password123', email='pin@test.com')
        self.client.force_authenticate(user=self.user)
        self.product = Product.objects.create(
            name='Test Eyeglasses 834001',
            price=2500.0,
            stock_quantity=10,
            category='eyeglasses'
        )

    def test_address_creation_rejects_non_ranchi_pincode(self):
        """Only 834001 and 834002 are accepted for addresses."""
        res = self.client.post('/api/addresses/', {
            'full_name': 'Out of Area User',
            'mobile': '7485067874',
            'street_address': 'Connaught Place',
            'city': 'Delhi',
            'state': 'Delhi',
            'pincode': '110001'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("pincode", res.data)

    def test_address_creation_accepts_834001_and_834002(self):
        """834001 and 834002 are accepted."""
        res1 = self.client.post('/api/addresses/', {
            'full_name': 'Ranchi User 1',
            'mobile': '7485067874',
            'street_address': 'Main Road Ranchi',
            'city': 'Ranchi',
            'state': 'Jharkhand',
            'pincode': '834001'
        }, format='json')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)

        res2 = self.client.post('/api/addresses/', {
            'full_name': 'Ranchi User 2',
            'mobile': '7033353140',
            'street_address': 'Doranda Ranchi',
            'city': 'Ranchi',
            'state': 'Jharkhand',
            'pincode': '834002'
        }, format='json')
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)

    def test_checkout_rejects_delivery_with_non_ranchi_pincode_in_address(self):
        """Checkout with invalid 6-digit pin in address string is rejected."""
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        res = self.client.post('/api/checkout/', {
            'address': 'Flat 402, MG Road, Bangalore, Karnataka - 560001',
            'mobile': '7485067874',
            'delivery_type': 'DELIVERY',
            'payment_method': 'COD'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Delivery is available ONLY for Ranchi pincodes 834001 and 834002", res.data.get('error', ''))

    def test_checkout_accepts_delivery_with_834001_or_834002(self):
        """Checkout with 834001 or 834002 succeeds."""
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        res = self.client.post('/api/checkout/', {
            'address': 'Sheetal Tower, Taxi Stand, Main Road, Ranchi - 834001',
            'mobile': '7485067874',
            'delivery_type': 'DELIVERY',
            'payment_method': 'COD'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_checkout_pickup_allowed_for_any_location(self):
        """Store pickup is permitted without address pincode limitation."""
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        res = self.client.post('/api/checkout/', {
            'mobile': '7485067874',
            'delivery_type': 'PICKUP',
            'payment_method': 'COD'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_product_serializer_always_returns_valid_image(self):
        """Product serializer never leaves image or image_url as null."""
        from store.serializers import ProductSerializer
        data = ProductSerializer(self.product).data
        self.assertTrue(data['image'])
        self.assertTrue(data['image_url'])
        self.assertTrue(data['image'].startswith('http'))
        self.assertTrue(data['image_url'].startswith('http'))

