from django.db import models


class User(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=256)
    first_login = models.IntegerField(default=1)
    age = models.IntegerField(blank=True, null=True)
    sex = models.CharField(max_length=1, blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    kcal = models.IntegerField(blank=True, null=True)
    protein = models.IntegerField(blank=True, null=True)
    carbohydrates = models.IntegerField(blank=True, null=True)
    fats = models.IntegerField(blank=True, null=True)
    water = models.IntegerField(blank=True, null=True)
    steps = models.IntegerField(blank=True, null=True)
    dishes = models.ForeignKey('Dish', on_delete=models.CASCADE, blank=True, null=True)
    active_days = models.ForeignKey('Day', on_delete=models.CASCADE, blank=True, null=True)
    trainings = models.ForeignKey('Training', on_delete=models.CASCADE, blank=True, null=True)


class Dish(models.Model):
    name = models.CharField(max_length=60)
    summary_kcal = models.FloatField()
    summary_protein = models.FloatField()
    summary_carbohydrates = models.FloatField()
    summary_fats = models.FloatField()
    summary_water = models.IntegerField()
    products = models.ManyToManyField('Product')


class Product(models.Model):
    name = models.CharField(max_length=60)
    type = models.CharField(max_length=60, blank=True, null=True)
    manufacturer = models.TextField()
    kcal = models.FloatField()
    protein = models.FloatField()
    carbohydrates = models.FloatField()
    fats = models.FloatField()
    portion = models.FloatField()


class Day(models.Model):
    date = models.DateField()
    summary_kcal = models.FloatField()
    summary_protein = models.FloatField()
    summary_carbohydrates = models.FloatField()
    summary_fats = models.FloatField()
    water = models.IntegerField()
    steps = models.IntegerField()
    weight = models.FloatField()
    meals = models.ForeignKey('Meal', on_delete=models.CASCADE, blank=True, null=True)


class Meal(models.Model):
    type = models.CharField(max_length=60)
    summary_kcal = models.FloatField()
    summary_protein = models.FloatField()
    summary_carbohydrates = models.FloatField()
    summary_fats = models.FloatField()
    products = models.ManyToManyField('Product')
    dishes = models.ManyToManyField('Dish')


class Training(models.Model):
    name = models.CharField(max_length=60)
    physical_activities = models.ManyToManyField('PhysicalActivity')


class PhysicalActivity(models.Model):
    name = models.CharField(max_length=60)
    type = models.CharField(max_length=60)
    lose_kcal = models.FloatField()
    time = models.IntegerField()
    repeats = models.IntegerField()