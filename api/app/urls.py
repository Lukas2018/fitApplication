from django.contrib import admin
from django.urls import path, include

from api.views import UserView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls'))
]
