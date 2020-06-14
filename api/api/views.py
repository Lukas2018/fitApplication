import json

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.core.exceptions import ObjectDoesNotExist
from api.serializers import UserSerializer, ProductSerializer, DishSerializer, DaySerializer, UserValidateSerializer
from api.models import User, Product, Dish


class UserValidateView(APIView):
    queryset = User.objects.all()

    def get(self, request):
        try:
            user = get_object_or_404(User, email=request.data['email'])
        except User.DoesNotExist:
            return HttpResponse(status.HTTP_404_NOT_FOUND)
        serializer = UserValidateSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserValidateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    queryset = User.objects.all()

    def get(self, request):
        serializer = UserSerializer(self.queryset.all(), many=True)
        return Response(serializer.data)


class UserDetailView(APIView):
    queryset = User.objects.all()

    def get(self, request, id):
        try:
            user = self.queryset.get(id=id)
        except User.DoesNotExist:
            return HttpResponse(status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def patch(self, request, id):
        try:
            user = self.queryset.get(id=id)
        except User.DoesNotExist:
            return HttpResponse(status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = self.queryset.get(id=id)
        except User.DoesNotExist:
            return HttpResponse(status.HTTP_404_NOT_FOUND)
        user.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)


class DishView(APIView):
    queryset = Dish.objects.all()

    def get(self, request):
        serializer = DishSerializer(self.queryset.all(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DishSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DishDetailView(APIView):
    queryset = Dish.objects.all()

    def get(self, request, id):
        try:
            dish = self.queryset.get(id=id)
        except Dish.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        serializer = DishSerializer(dish)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            dish = self.queryset.get(id=id)
        except Dish.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        serializer = DishSerializer(dish, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            dish = self.queryset.get(id=id)
        except Dish.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        dish.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)


class ProductView(APIView):
    queryset = Product.objects.all()

    def get(self, request):
        serializer = ProductSerializer(self.queryset.all(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    queryset = Product.objects.all()

    def get(self, request, id):
        try:
            product = self.queryset.get(id=id)
        except Product.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            product = self.queryset.get(id=id)
        except Product.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            product = self.queryset.get(id=id)
        except Product.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)


class UserDayView(APIView):
    queryset = User.objects.all()

    def get(self, request, user_id):
        serializer = DaySerializer(self.queryset.get(id=user_id).active_days)
        return Response(serializer.data)

    def post(self, request, user_id):
        serializer = DaySerializer(request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


