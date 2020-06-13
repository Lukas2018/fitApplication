from django.urls import path

from api.views import UserView, UserDetailView, ProductView, ProductDetailView, UserDayView, UserValidateView

urlpatterns = [
    path('userValidate/', UserValidateView.as_view()),
    path('user/', UserView.as_view()),
    path('user/<int:id>', UserDetailView.as_view()),
    path('user/<int:id>/day/', UserDayView.as_view()),
    path('product/', ProductView.as_view()),
    path('product/<int:id>', ProductDetailView.as_view()),
]
