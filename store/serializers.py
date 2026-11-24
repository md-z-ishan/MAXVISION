from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Prescription, UserProfile, Cart, Wishlist, Order, OrderItem, HomeVisitRequest

class HomeVisitRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeVisitRequest
        fields = ['id', 'name', 'phone', 'address', 'preferred_date', 'status', 'notes', 'created_at']
        read_only_fields = ['status', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'is_staff']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'product', 'product_id', 'quantity', 'lens_package', 'lens_price', 'subtotal']

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id']

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'name', 'od_sph', 'od_cyl', 'od_axis', 'od_add', 'os_sph', 'os_cyl', 'os_axis', 'os_add', 'pd', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'lens_package', 'lens_price', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    prescription = PrescriptionSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'address', 'mobile', 'total_amount', 'status', 'stock_restored',
            'payment_method', 'payment_status', 'utr_number', 'delivery_type',
            'delivery_charge', 'prescription', 'prescription_file', 'created_at', 'updated_at', 'items'
        ]

