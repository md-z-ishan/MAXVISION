from django.contrib import admin
from .models import Product, Cart, Wishlist, Order, OrderItem, Prescription, UserProfile, Invoice

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'brand', 'price', 'discount_percentage', 'stock_quantity')
    list_filter = ('category', 'frame_shape', 'frame_size', 'brand')

admin.site.register(Product, ProductAdmin)
admin.site.register(Prescription)
admin.site.register(UserProfile)
admin.site.register(Cart)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product')
    list_filter = ('user', 'product')

admin.site.register(Wishlist, WishlistAdmin)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'prescription_file', 'created_at')
    list_filter = ('status', 'created_at')

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(Invoice)