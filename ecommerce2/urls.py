from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from store.media_views import protected_media_serve

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^media/(?P<path>.*)$', protected_media_serve, name='protected_media'),
    path('', include('store.urls')),
]