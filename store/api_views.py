from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Product, Cart, Wishlist, Order, OrderItem
from .serializers import (
    ProductSerializer, CartSerializer, WishlistSerializer, 
    OrderSerializer, UserSerializer
)
import uuid

# -- PRODUCT VIEWS --
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get('q')
        category = self.request.query_params.get('category')
        shape = self.request.query_params.get('shape')
        size = self.request.query_params.get('size')
        color = self.request.query_params.get('color')
        brand = self.request.query_params.get('brand')

        if query:
            queryset = queryset.filter(name__icontains=query)
        if category:
            queryset = queryset.filter(category=category)
        if shape:
            queryset = queryset.filter(frame_shape=shape)
        if size:
            queryset = queryset.filter(frame_size=size)
        if color:
            queryset = queryset.filter(frame_color__icontains=color)
        if brand:
            queryset = queryset.filter(brand__icontains=brand)
        return queryset

# -- CART VIEWS --
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get('product_id')
        lens_package = self.request.data.get('lens_package', 'frame_only')
        
        lens_price = 0.0
        if lens_package == 'single_vision':
            lens_price = 500.0
        elif lens_package == 'bifocal':
            lens_price = 1500.0
        elif lens_package == 'zero_power':
            lens_price = 300.0

        cart_item = Cart.objects.filter(user=self.request.user, product_id=product_id, lens_package=lens_package).first()
        if cart_item:
            cart_item.quantity += 1
            cart_item.save()
            return cart_item
        else:
            serializer.save(user=self.request.user, lens_price=lens_price)

class UpdateCartQuantity(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk, action):
        try:
            cart_item = Cart.objects.get(pk=pk, user=request.user)
            if action == 'increase':
                cart_item.quantity += 1
            elif action == 'decrease' and cart_item.quantity > 1:
                cart_item.quantity -= 1
            cart_item.save()
            return Response(CartSerializer(cart_item).data)
        except Cart.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

# -- WISHLIST VIEWS --
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class ToggleWishlistAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, product_id):
        item = Wishlist.objects.filter(user=request.user, product_id=product_id).first()
        if item:
            item.delete()
            return Response({"status": "removed"})
        else:
            Wishlist.objects.create(user=request.user, product_id=product_id)
            return Response({"status": "added"})

# -- ORDER / CHECKOUT VIEWS --
class CheckoutAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        address = request.data.get('address')
        mobile = request.data.get('mobile')
        cart_items = Cart.objects.filter(user=request.user)

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(item.subtotal() for item in cart_items)
        
        order = Order.objects.create(
            user=request.user,
            address=address,
            mobile=mobile,
            total_amount=total,
            status="Pending"
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.discounted_price,
                lens_package=item.lens_package,
                lens_price=item.lens_price
            )
        
        cart_items.delete()
        return Response({"message": "Order placed successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)

class UserOrdersAPI(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

# -- AUTH VIEWS --
class RegisterUserAPI(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class UserProfileAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
