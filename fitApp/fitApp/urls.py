"""site URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('index/', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('user_data/', views.user_data, name='user_data'),
    path('calendar/', views.calendar, name='calendar'),
    path('user_panel/', views.user_panel, name='user_panel'),
    path('password_change/', views.password_change, name='password_change'),
    path('product/', views.product, name='product'),
    path('save_index_data/', views.save_index_data, name='save_index_data'),
    path('save_weight/', views.save_weight, name='save_weight'),
    path('save_pulse/', views.save_pulse, name='save_pulse'),
    path('save_water/', views.save_water, name='save_water'),
    path('get_day_data/', views.get_day_data, name='get_day_data')
]
