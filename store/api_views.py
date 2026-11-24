from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, FileResponse
from django.conf import settings
from django.core.mail import send_mail
from .models import (
    Product, Cart, Wishlist, Order, OrderItem,
    HomeVisitRequest, Prescription, OrderStatusHistory,
    StorePaymentSettings, Address, Invoice, UserProfile
)
from .serializers import (
    ProductSerializer, CartSerializer, WishlistSerializer, 
    OrderSerializer, UserSerializer, HomeVisitRequestSerializer,
    PrescriptionSerializer, AddressSerializer, StorePaymentSettingsSerializer
)
from .utils import render_to_pdf, generate_serial_number, notify_shop
import uuid
import re
import logging

logger = logging.getLogger(__name__)

# -- PRODUCT VIEWS --
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get('q') or self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        shape = self.request.query_params.get('shape')
        size = self.request.query_params.get('size')
        color = self.request.query_params.get('color')
        brand = self.request.query_params.get('brand')
        lens_type = self.request.query_params.get('lens_type')
        wear_duration = self.request.query_params.get('wear_duration')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        ordering = self.request.query_params.get('ordering') or self.request.query_params.get('sort')

        if query:
            queryset = queryset.filter(name__icontains=query)
        if category:
            cat_norm = category.strip().lower()
            if cat_norm in ['contacts', 'contact', 'contact-lenses', 'contact_lens']:
                cat_norm = 'contact_lenses'
            queryset = queryset.filter(category__iexact=cat_norm)
        if shape:
            queryset = queryset.filter(frame_shape__iexact=shape)
        if size:
            queryset = queryset.filter(frame_size__iexact=size)
        if color:
            queryset = queryset.filter(frame_color__icontains=color)
        if brand:
            queryset = queryset.filter(brand__icontains=brand)
        if lens_type:
            queryset = queryset.filter(lens_type__iexact=lens_type)
        if wear_duration:
            queryset = queryset.filter(wear_duration__iexact=wear_duration)
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except (ValueError, TypeError):
                pass

        if ordering:
            ord_norm = ordering.strip().lower()
            if ord_norm in ['price_low', 'price_asc', 'price-low-to-high']:
                queryset = queryset.order_by('price')
            elif ord_norm in ['price_high', 'price_desc', 'price-high-to-low']:
                queryset = queryset.order_by('-price')
            elif ord_norm in ['newest', 'new']:
                queryset = queryset.order_by('-id')
            elif ord_norm in ['discount', 'discount_desc']:
                queryset = queryset.order_by('-discount_percentage')
            elif ord_norm == 'recommended':
                queryset = queryset.order_by('id')

        return queryset

    @action(detail=False, methods=['get'])
    def filter_options(self, request):
        categories = list(Product.objects.values_list('category', flat=True).distinct())
        brands = list(Product.objects.exclude(brand__isnull=True).exclude(brand='').values_list('brand', flat=True).distinct())
        shapes = list(Product.objects.exclude(frame_shape__isnull=True).exclude(frame_shape='none').values_list('frame_shape', flat=True).distinct())
        sizes = list(Product.objects.exclude(frame_size__isnull=True).exclude(frame_size='none').values_list('frame_size', flat=True).distinct())
        lens_types = list(Product.objects.exclude(lens_type__isnull=True).exclude(lens_type='').values_list('lens_type', flat=True).distinct())
        wear_durations = list(Product.objects.exclude(wear_duration__isnull=True).exclude(wear_duration='').values_list('wear_duration', flat=True).distinct())
        return Response({
            'categories': [c for c in categories if c],
            'brands': sorted([b for b in brands if b]),
            'shapes': [s for s in shapes if s],
            'sizes': [s for s in sizes if s],
            'lens_types': [lt for lt in lens_types if lt],
            'wear_durations': [wd for wd in wear_durations if wd],
        })

# -- CART VIEWS --
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get('product_id')
        lens_package = self.request.data.get('lens_package', 'frame_only')

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError({"error": "Product not found"})

        if product.stock_quantity <= 0:
            raise serializers.ValidationError({"error": f"'{product.name}' is currently out of stock."})

        cart_item = Cart.objects.filter(user=self.request.user, product_id=product_id, lens_package=lens_package).first()
        if cart_item:
            if cart_item.quantity + 1 > product.stock_quantity:
                raise serializers.ValidationError({"error": f"Cannot add more. Only {product.stock_quantity} available in stock."})
            cart_item.quantity += 1
            cart_item.save()
            return cart_item
        else:
            lens_price = 0.0
            if lens_package == 'single_vision':
                lens_price = 500.0
            elif lens_package == 'bifocal':
                lens_price = 1500.0
            elif lens_package == 'zero_power':
                lens_price = 300.0
            serializer.save(user=self.request.user, lens_price=lens_price)

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        lens_package = request.data.get('lens_package', 'frame_only')

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        if product.stock_quantity <= 0:
            return Response(
                {"error": f"'{product.name}' is currently out of stock."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item = Cart.objects.filter(user=request.user, product_id=product_id, lens_package=lens_package).first()
        if cart_item:
            if cart_item.quantity + 1 > product.stock_quantity:
                return Response(
                    {"error": f"Cannot add more. Only {product.stock_quantity} available in stock."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity += 1
            cart_item.save()
            return Response(CartSerializer(cart_item).data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class UpdateCartQuantity(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk, action):
        try:
            cart_item = Cart.objects.get(pk=pk, user=request.user)
            if action == 'increase':
                if cart_item.quantity + 1 > cart_item.product.stock_quantity:
                    return Response(
                        {"error": f"Maximum available stock is {cart_item.product.stock_quantity}."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
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
def validate_power_step(val_name, val, min_val=-10.0, max_val=10.0, step=0.25):
    if val is None or str(val).strip() == '':
        return 0.0, None
    try:
        fval = round(float(val), 2)
    except (TypeError, ValueError):
        return None, f"Invalid value for {val_name}. Must be a valid number."
    if fval < min_val or fval > max_val:
        return None, f"{val_name} ({fval}) must be between {min_val} and {max_val}."
    rem = round((fval * 100) % 25, 2)
    if rem != 0.0 and rem != 25.0:
        return None, f"{val_name} ({fval}) must be in steps of 0.25 (e.g., -0.25, -0.50, +1.25)."
    return fval, None

def validate_axis_val(val_name, val, cyl_val=0.0):
    if val is None or str(val).strip() == '':
        if abs(cyl_val) > 0.0001:
            return None, f"{val_name} is required between 1° and 180° when Cylinder (CYL) is specified."
        return 0, None
    try:
        ival = int(val)
    except (TypeError, ValueError):
        return None, f"Invalid value for {val_name}. Must be an integer."
    if ival < 0 or ival > 180:
        return None, f"{val_name} ({ival}) must be between 0 and 180 degrees."
    if abs(cyl_val) > 0.0001 and ival == 0:
        return None, f"{val_name} cannot be 0° when Cylinder (CYL) is specified (must be 1° to 180°)."
    return ival, None

def validate_pd_val(val):
    if val is None or str(val).strip() == '':
        return None, None
    try:
        fval = round(float(val), 1)
    except (TypeError, ValueError):
        return None, "Invalid Pupillary Distance (PD). Must be a valid number."
    if fval < 50.0 or fval > 80.0:
        return None, f"Pupillary Distance (PD: {fval}mm) must be between 50 and 80 mm."
    return fval, None

class CheckoutAPI(APIView):
    throttle_scope = 'checkout'
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        address = request.data.get('address', '')
        if isinstance(address, str):
            address = address.strip()
        mobile = request.data.get('mobile', '')
        if isinstance(mobile, str):
            mobile = mobile.strip()
        prescription_file = request.FILES.get('prescription_file')

        payment_method = str(request.data.get('payment_method', 'COD')).upper().strip()
        if payment_method not in ['COD', 'UPI']:
            payment_method = 'COD'
        utr_number = str(request.data.get('utr_number', '')).strip()

        delivery_type = str(request.data.get('delivery_type', 'DELIVERY')).upper().strip()
        if delivery_type not in ['DELIVERY', 'PICKUP']:
            delivery_type = 'DELIVERY'

        prescription_option = str(request.data.get('prescription_option', 'none')).lower().strip()

        if not mobile:
            return Response({"error": "Mobile number is required."}, status=status.HTTP_400_BAD_REQUEST)

        if delivery_type == 'PICKUP':
            pickup_address = "Store Pickup: Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi"
            address = address or pickup_address
            delivery_charge = 0.0
        else:
            if not address:
                return Response({"error": "Delivery address is required for Home Delivery."}, status=status.HTTP_400_BAD_REQUEST)
            delivery_charge = float(getattr(settings, 'DELIVERY_CHARGE', 0.0))

        if payment_method == 'UPI':
            if not utr_number or not re.match(r'^[a-zA-Z0-9]{10,22}$', utr_number):
                return Response(
                    {"error": "Please enter a valid 10 to 22 character alphanumeric UPI Reference / UTR Number."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if Order.objects.filter(utr_number__iexact=utr_number).exists():
                return Response(
                    {"error": "This UTR number has already been submitted for another order. Please check and provide your unique transaction UTR number."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            payment_status = 'PENDING_VERIFICATION'
        else:
            payment_status = 'UNPAID'
            utr_number = None

        if prescription_file:
            if prescription_file.size > 5 * 1024 * 1024:
                return Response({"error": "Prescription file size exceeds 5 MB limit."}, status=status.HTTP_400_BAD_REQUEST)
            ext = prescription_file.name.lower().split('.')[-1]
            if ext not in ['pdf', 'jpg', 'jpeg', 'png']:
                return Response({"error": "Prescription file must be a valid PDF, JPG, or PNG document."}, status=status.HTTP_400_BAD_REQUEST)

        prescription_obj = None
        if prescription_option == 'manual':
            od_sph, err = validate_power_step('Right Eye (OD) SPH', request.data.get('od_sph', 0))
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)
            
            od_cyl, err = validate_power_step('Right Eye (OD) CYL', request.data.get('od_cyl', 0))
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)
            
            od_axis, err = validate_axis_val('Right Eye (OD) AXIS', request.data.get('od_axis'), od_cyl)
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)
            
            od_add, err = validate_power_step('Right Eye (OD) ADD', request.data.get('od_add', 0), min_val=0.0, max_val=4.0)
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)

            os_sph, err = validate_power_step('Left Eye (OS) SPH', request.data.get('os_sph', 0))
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)
            
            os_cyl, err = validate_power_step('Left Eye (OS) CYL', request.data.get('os_cyl', 0))
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)
            
            os_axis, err = validate_axis_val('Left Eye (OS) AXIS', request.data.get('os_axis'), os_cyl)
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)
            
            os_add, err = validate_power_step('Left Eye (OS) ADD', request.data.get('os_add', 0), min_val=0.0, max_val=4.0)
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)

            pd_val, err = validate_pd_val(request.data.get('pd'))
            if err: return Response({"error": err}, status=status.HTTP_400_BAD_REQUEST)

            prescription_obj = Prescription.objects.create(
                user=request.user,
                name=f"Prescription by {request.user.username}",
                od_sph=od_sph,
                od_cyl=od_cyl,
                od_axis=od_axis,
                od_add=od_add,
                os_sph=os_sph,
                os_cyl=os_cyl,
                os_axis=os_axis,
                os_add=os_add,
                pd=pd_val
            )
        elif prescription_option == 'none':
            prescription_file = None

        from django.db import transaction
        from django.db.models import F

        with transaction.atomic():
            cart_items = Cart.objects.select_related('product').select_for_update().filter(user=request.user)

            if not cart_items.exists():
                return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

            for item in cart_items:
                rows_updated = Product.objects.filter(
                    pk=item.product_id,
                    stock_quantity__gte=item.quantity
                ).update(stock_quantity=F('stock_quantity') - item.quantity)

                if rows_updated == 0:
                    transaction.set_rollback(True)
                    return Response(
                        {"error": f"Insufficient stock for '{item.product.name}'. Available: {item.product.stock_quantity}, Requested: {item.quantity}."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            items_total = sum(item.subtotal() for item in cart_items)
            total = round(items_total + delivery_charge, 2)

            order = Order.objects.create(
                user=request.user,
                address=address,
                mobile=mobile,
                total_amount=total,
                status="Pending",
                payment_method=payment_method,
                payment_status=payment_status,
                utr_number=utr_number,
                delivery_type=delivery_type,
                delivery_charge=delivery_charge,
                prescription=prescription_obj,
                prescription_file=prescription_file
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

            OrderStatusHistory.objects.create(
                order=order,
                status="Pending",
                notes=f"Order created with {payment_method} ({payment_status}). Delivery: {delivery_type}."
            )

            cart_items.delete()

            # Create Invoice record safely
            try:
                Invoice.objects.create(
                    order=order,
                    serial_number=generate_serial_number()
                )
            except Exception as e:
                logger.error(f"Failed to create invoice record for order #{order.id}: {e}")

            # Notify shop owner via email
            notify_shop(order)

            return Response({
                "message": "Order placed successfully",
                "order_id": order.id,
                "payment_status": payment_status,
                "total_amount": total
            }, status=status.HTTP_201_CREATED)


class UserOrdersAPI(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

# -- AUTH VIEWS --
class RegisterUserAPI(APIView):
    throttle_scope = 'auth'
    def post(self, request):
        # Strict Customer registration guard: Reject attempts to inject privileged fields
        disallowed_fields = ['is_staff', 'is_superuser', 'groups', 'user_permissions', 'role']
        if any(field in request.data for field in disallowed_fields):
            return Response(
                {"error": "Privilege escalation rejected: Customer registration cannot assign staff, superuser, or group roles."},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        email = request.data.get('email', '').strip()
        mobile = request.data.get('mobile', '').strip()
        first_name = request.data.get('first_name', '').strip()

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if mobile:
            if not re.match(r'^[6-9]\d{9}$', mobile):
                return Response(
                    {"error": "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if UserProfile.objects.filter(mobile=mobile).exists():
                return Response({"error": "An account with this mobile number already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name)
        if mobile:
            UserProfile.objects.create(user=user, mobile=mobile)

        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class UserProfileAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        data = UserSerializer(request.user).data
        data['mobile'] = profile.mobile if profile else ''
        return Response(data)

    def patch(self, request):
        user = request.user
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        mobile = request.data.get('mobile')

        if first_name is not None:
            user.first_name = first_name.strip()
        if last_name is not None:
            user.last_name = last_name.strip()
        if email is not None:
            user.email = email.strip()
        user.save()

        if mobile is not None:
            mobile_str = str(mobile).strip()
            if mobile_str and not re.match(r'^[6-9]\d{9}$', mobile_str):
                return Response(
                    {"error": "Please enter a valid 10-digit Indian mobile number starting with 6-9."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.mobile = mobile_str
            profile.save()

        profile = getattr(user, 'profile', None)
        data = UserSerializer(user).data
        data['mobile'] = profile.mobile if profile else ''
        return Response(data)

class PasswordResetRequestAPI(APIView):
    throttle_scope = 'auth'
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({"error": "Please provide your registered email address."}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(email__iexact=email)
        if users.exists():
            for user in users:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"

                subject = "Password Reset Request - MAXVISION Optical"
                message = (
                    f"Hi {user.username},\n\n"
                    f"You requested a password reset for your MAXVISION Optical account.\n"
                    f"Click or open the link below to set a new password:\n{reset_link}\n\n"
                    f"If you did not request this, please ignore this email.\n\n"
                    f"MAXVISION Optical Team\nRanchi, Jharkhand"
                )
                try:
                    send_mail(subject, message, getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@maxvision.com'), [user.email], fail_silently=True)
                except Exception as e:
                    logger.error(f"Error sending password reset email: {e}")

        return Response({
            "message": "If an account with this email exists, a password reset link has been sent. Please check your inbox or server console."
        }, status=status.HTTP_200_OK)

class PasswordResetConfirmAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uidb64 or not token or not new_password:
            return Response({"error": "UID, token, and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({"error": "Password must be at least 6 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid password reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password has been successfully reset. You can now login."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Password reset token is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

# -- PAYMENT SETTINGS & INVOICE APIS --
class PaymentSettingsAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings_obj = StorePaymentSettings.get_settings()
        if settings_obj.upi_enabled and settings_obj.qr_image and settings_obj.upi_id:
            return Response({
                "upi_enabled": True,
                "upi_id": settings_obj.upi_id,
                "display_name": settings_obj.display_name,
                "qr_image": request.build_absolute_uri(settings_obj.qr_image.url)
            })
        return Response({"upi_enabled": False})

class OrderInvoiceAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.user != request.user and not request.user.is_staff:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        invoice, _ = Invoice.objects.get_or_create(
            order=order,
            defaults={'serial_number': generate_serial_number()}
        )
        pdf_buffer = render_to_pdf(None, {'order': order, 'invoice': invoice, 'items': order.items.all()})

        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="MAXVISION_Invoice_{order.id}.pdf"'
        return response

class OrderPrescriptionDownloadAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.user != request.user and not request.user.is_staff:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        if not order.prescription_file:
            return Response({"error": "No prescription document was uploaded for this order."}, status=status.HTTP_404_NOT_FOUND)

        try:
            return FileResponse(order.prescription_file.open('rb'), content_type='application/octet-stream')
        except Exception as e:
            return Response({"error": f"Unable to read file: {e}"}, status=status.HTTP_404_NOT_FOUND)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HealthCheckAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        db_status = "connected"
        try:
            from django.db import connection
            connection.ensure_connection()
        except Exception as e:
            db_status = f"unreachable: {str(e)}"

        status_code = status.HTTP_200_OK if db_status == "connected" else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response({
            "status": "ok" if db_status == "connected" else "degraded",
            "database": db_status,
            "service": "MAXVISION Optical API",
            "time": timezone.now().isoformat()
        }, status=status_code)

class AdminDashboardStatsAPI(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        from django.db.models import Sum
        today = timezone.now().date()
        total_orders = Order.objects.count()
        today_orders = Order.objects.filter(created_at__date=today).count()
        pending_orders = Order.objects.filter(status__iexact='Pending').count()
        total_sales_res = Order.objects.filter(payment_status='PAID').aggregate(total=Sum('total_amount'))
        total_sales = total_sales_res['total'] or 0.0
        low_stock_count = Product.objects.filter(stock_quantity__lte=5).count()

        return Response({
            "total_orders": total_orders,
            "today_orders": today_orders,
            "pending_orders": pending_orders,
            "total_sales": float(total_sales),
            "low_stock_products": low_stock_count
        })

class HomeVisitRequestAPI(generics.CreateAPIView):
    queryset = HomeVisitRequest.objects.all()
    serializer_class = HomeVisitRequestSerializer
    permission_classes = [permissions.AllowAny]
