from django.contrib import admin
from django.utils import timezone
from datetime import timedelta
from .models import (
    Product, Cart, Wishlist, Order, OrderItem, Prescription,
    UserProfile, Invoice, HomeVisitRequest, OrderStatusHistory,
    StorePaymentSettings, Address
)

class HomeVisitRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'preferred_date', 'status', 'created_at')
    list_filter = ('status', 'preferred_date', 'created_at')
    search_fields = ('name', 'phone', 'address')

admin.site.register(HomeVisitRequest, HomeVisitRequestAdmin)

class LowStockFilter(admin.SimpleListFilter):
    title = 'Stock Level'
    parameter_name = 'stock_level'

    def lookups(self, request, model_admin):
        return [
            ('out_of_stock', 'Out of Stock (0)'),
            ('low_stock', 'Low Stock (1-5)'),
            ('in_stock', 'In Stock (>5)'),
        ]

    def queryset(self, request, queryset):
        if self.value() == 'out_of_stock':
            return queryset.filter(stock_quantity=0)
        elif self.value() == 'low_stock':
            return queryset.filter(stock_quantity__gte=1, stock_quantity__lte=5)
        elif self.value() == 'in_stock':
            return queryset.filter(stock_quantity__gt=5)
        return queryset

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'brand', 'price', 'discount_percentage', 'stock_quantity', 'lens_type', 'wear_duration')
    list_filter = ('category', LowStockFilter, 'lens_type', 'wear_duration', 'frame_shape', 'frame_size', 'brand')
    search_fields = ('name', 'brand', 'frame_color')

admin.site.register(Product, ProductAdmin)
admin.site.register(Prescription)
admin.site.register(UserProfile)
admin.site.register(Cart)

class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product')
    list_filter = ('user', 'product')

admin.site.register(Wishlist, WishlistAdmin)

class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ('created_at',)

class PendingUPIVerification24hFilter(admin.SimpleListFilter):
    title = 'UPI verification pending (>24h)'
    parameter_name = 'upi_pending_24h'

    def lookups(self, request, model_admin):
        return [('yes', 'Pending > 24 hours')]

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            cutoff = timezone.now() - timedelta(hours=24)
            return queryset.filter(
                payment_method='UPI',
                payment_status='PENDING_VERIFICATION',
                created_at__lte=cutoff
            )
        return queryset

class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'total_amount', 'status', 'payment_method',
        'payment_status', 'utr_number', 'delivery_type', 'stock_restored', 'created_at'
    )
    list_filter = (
        'status', 'payment_method', 'payment_status',
        PendingUPIVerification24hFilter, 'delivery_type', 'stock_restored', 'created_at'
    )
    readonly_fields = ('stock_restored', 'payment_verified_by', 'payment_verified_at')
    inlines = [OrderStatusHistoryInline]
    actions = ['mark_as_paid']

    @admin.action(description="Mark selected orders as Paid")
    def mark_as_paid(self, request, queryset):
        count = 0
        now = timezone.now()
        for order in queryset:
            order.payment_status = 'PAID'
            order.payment_verified_by = request.user
            order.payment_verified_at = now
            order.save()
            OrderStatusHistory.objects.create(
                order=order,
                status=order.status,
                notes=f"Payment marked as PAID by admin {request.user.username} at {now.strftime('%Y-%m-%d %H:%M:%S')}"
            )
            count += 1
        self.message_user(request, f"{count} order(s) marked as PAID.")

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(Invoice)
admin.site.register(OrderStatusHistory)

class StorePaymentSettingsAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'upi_id', 'display_name', 'upi_enabled', 'updated_at')
    fields = ('upi_enabled', 'upi_id', 'display_name', 'qr_image', 'updated_at')
    readonly_fields = ('updated_at',)

    def has_add_permission(self, request):
        # Singleton: allow add only if no settings exist
        return not StorePaymentSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

admin.site.register(StorePaymentSettings, StorePaymentSettingsAdmin)

class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'mobile', 'city', 'pincode', 'is_default', 'created_at')
    list_filter = ('city', 'state', 'is_default')
    search_fields = ('full_name', 'mobile', 'street_address', 'pincode', 'user__username')

admin.site.register(Address, AddressAdmin)

