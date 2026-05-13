from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),

    path('products/', views.products, name='products'),
    path('product/<int:id>/', views.product_detail, name='product_detail'),

    path('cart/', views.cart_view, name='cart'),
    path('add-to-cart/<int:id>/', views.add_to_cart, name='add_to_cart'),
    path(
        'cart/update/<int:id>/<str:action>/',
        views.update_cart_quantity,
        name='update_cart_quantity'
    ),
    path(
    'cart/remove/<int:id>/',
        views.remove_from_cart,
        name='remove_from_cart'
    ),
    path('ai/', views.ai_suggest, name='ai_suggest'),

path('wishlist/toggle/<int:id>/', views.toggle_wishlist, name='toggle_wishlist'),
path('wishlist/', views.wishlist_view, name='wishlist'),

    path('checkout/', views.checkout, name='checkout'),
    path('orders/', views.orders, name='orders'),
    # ADMIN
path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
path('dashboard/sales/', views.admin_sales, name='admin_sales'),
path('dashboard/sales/export/', views.export_orders_csv, name='export_orders_csv'),
path('dashboard/add-product/', views.admin_add_product, name='admin_add_product'),
path('dashboard/edit-product/<int:id>/', views.admin_edit_product, name='admin_edit_product'),
    path('dashboard/delete-product/<int:id>/', views.admin_delete_product, name='admin_delete_product'),
    path('dashboard/update-order/<int:id>/', views.admin_update_order_status, name='admin_update_order_status'),
]

# --- API URLS ---
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import api_views

router = DefaultRouter()
router.register(r'api/products', api_views.ProductViewSet, basename='api_products')
router.register(r'api/cart', api_views.CartViewSet, basename='api_cart')
router.register(r'api/wishlist', api_views.WishlistViewSet, basename='api_wishlist')

urlpatterns += router.urls

urlpatterns += [
    path('api/auth/register/', api_views.RegisterUserAPI.as_view(), name='api_register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/profile/', api_views.UserProfileAPI.as_view(), name='api_profile'),
    path('api/cart/update/<int:pk>/<str:action>/', api_views.UpdateCartQuantity.as_view(), name='api_update_cart'),
    path('api/wishlist/toggle/<int:product_id>/', api_views.ToggleWishlistAPI.as_view(), name='api_toggle_wishlist'),
    path('api/checkout/', api_views.CheckoutAPI.as_view(), name='api_checkout'),
    path('api/orders/', api_views.UserOrdersAPI.as_view(), name='api_orders'),
]