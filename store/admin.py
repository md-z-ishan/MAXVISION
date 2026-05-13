from django.contrib import admin
from .models import Product, Cart, Wishlist, Order, OrderItem, Prescription, UserProfile, Invoice

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'brand', 'price', 'discount_percentage', 'stock_quantity')
    list_filter = ('category', 'frame_shape', 'frame_size', 'brand')

admin.site.register(Product, ProductAdmin)
admin.site.register(Prescription)
admin.site.register(UserProfile)
admin.site.register(Cart)
admin.site.register(Wishlist)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Invoice)