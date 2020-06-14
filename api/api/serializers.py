from api.models import User, Dish, Product, Day, Meal, PhysicalActivity
from rest_framework import serializers


class UserValidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'password',
            'first_login'
        )


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'type',
            'manufacturer',
            'kcal',
            'protein',
            'carbohydrates',
            'fats',
            'portion'
        ]
        read_only_fields = ['id']


class DishSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Dish
        fields = [
            'id',
            'name',
            'summary_kcal',
            'summary_protein',
            'summary_carbohydrates',
            'summary_fats',
            'summary_water',
            'products'
        ]
        read_only_fields = ['id']


class MealSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Meal
        fields = [
            'id',
            'summary_kcal',
            'summary_protein',
            'summary_carbohydrates',
            'summary_fats',
            'products',
            'dishes'
        ]


class PhysicalActivitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PhysicalActivity
        fields = [
            'id',
            'name',
            'type',
            'lose_kcal',
        ]
        read_only_fields = ['id']


class DaySerializer(serializers.HyperlinkedModelSerializer):
    meals = MealSerializer(many=True, read_only=True)
    physical_activities = PhysicalActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Day
        fields = [
            'id',
            'date',
            'kcal',
            'protein',
            'carbohydrates',
            'fats',
            'meals',
            'physical_activities'
        ]
        read_only_fields = ['id']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    active_days = DaySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'age',
            'sex',
            'weight',
            'height',
            'kcal',
            'protein',
            'carbohydrates',
            'fats',
            'water',
            'steps'
            'active_days'
        ]
        read_only_fields = ['id']

