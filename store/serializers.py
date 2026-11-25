from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Product, Prescription, UserProfile, Cart, Wishlist,
    Order, OrderItem, HomeVisitRequest, StorePaymentSettings, Address
)

class HomeVisitRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeVisitRequest
        fields = ['id', 'name', 'phone', 'address', 'preferred_date', 'status', 'notes', 'created_at']
        read_only_fields = ['status', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_name', 'mobile', 'street_address', 'city', 'state', 'pincode', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_pincode(self, value):
        val = str(value).strip()
        ALLOWED_PINCODES = {'834001', '834002'}
        if val not in ALLOWED_PINCODES:
            raise serializers.ValidationError(
                "Delivery is strictly limited to Ranchi pincodes 834001 and 834002."
            )
        return val

class StorePaymentSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorePaymentSettings
        fields = ['upi_id', 'display_name', 'qr_image', 'upi_enabled']


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        if obj.image:
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image.url)
                return f"http://127.0.0.1:8000{obj.image.url}"
            except Exception:
                pass
        if obj.image_url:
            return obj.image_url
        return "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=450&fit=crop&auto=format"

    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url
        if obj.image:
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image.url)
                return f"http://127.0.0.1:8000{obj.image.url}"
            except Exception:
                pass
        return "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=450&fit=crop&auto=format"

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
            'delivery_charge', 'prescription', 'prescription_file', 'payment_verified_at',
            'created_at', 'updated_at', 'items'
        ]

