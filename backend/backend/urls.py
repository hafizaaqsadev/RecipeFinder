from django.contrib import admin
from django.urls import path, include  # include is necessary to include app URLs

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')), 
    path('api/favorites/', include('favorites.urls')), 
]
