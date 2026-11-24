from django.contrib import admin
from .models import Product, Cart, Wishlist, Order, OrderItem, Prescription, UserProfile, Invoice, HomeVisitRequest, OrderStatusHistory

class HomeVisitRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'preferred_date', 'status', 'created_at')
    list_filter = ('status', 'preferred_date', 'created_at')
    search_fields = ('name', 'phone', 'address')

admin.site.register(HomeVisitRequest, HomeVisitRequestAdmin)

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'brand', 'price', 'discount_percentage', 'stock_quantity', 'lens_type', 'wear_duration')
    list_filter = ('category', 'lens_type', 'wear_duration', 'frame_shape', 'frame_size', 'brand')

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

class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'total_amount', 'status', 'payment_method',
        'payment_status', 'delivery_type', 'utr_number', 'stock_restored', 'created_at'
    )
    list_filter = (
        'status', 'payment_method', 'payment_status',
        'delivery_type', 'stock_restored', 'created_at'
    )
    readonly_fields = ('stock_restored',)
    inlines = [OrderStatusHistoryInline]
    actions = ['mark_as_paid']

    @admin.action(description="Mark selected orders as Paid")
    def mark_as_paid(self, request, queryset):
        count = 0
        for order in queryset:
            order.payment_status = 'PAID'
            order.save()
            OrderStatusHistory.objects.create(
                order=order,
                status=order.status,
                notes=f"Payment marked as PAID by admin {request.user.username}"
            )
            count += 1
        self.message_user(request, f"{count} order(s) marked as PAID.")

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(Invoice)
admin.site.register(OrderStatusHistory)
