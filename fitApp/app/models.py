from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_login = models.IntegerField(default=1)
    age = models.IntegerField(blank=True, null=True)
    sex = models.CharField(max_length=1, blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    pulse = models.IntegerField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    kcal = models.IntegerField(blank=True, null=True)
    protein = models.FloatField(blank=True, null=True)
    carbohydrates = models.FloatField(blank=True, null=True)
    fats = models.FloatField(blank=True, null=True)
    water = models.IntegerField(blank=True, null=True)
    steps = models.IntegerField(blank=True, null=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256)
    manufacturer = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    nutrient = models.OneToOneField('Nutrientes', on_delete=models.CASCADE)
    
class Nutrientes(models.Model):
    kcal = models.FloatField()
    protein = models.FloatField()
    carbohydrates = models.FloatField()
    fats = models.FloatField()
    portion = models.FloatField()

class Day(models.Model):
    date = models.DateField()
    summary_kcal = models.FloatField(default=0)
    expected_kcal = models.FloatField(default=0)
    lose_kcal = models.FloatField(default=0)
    summary_protein = models.FloatField(default=0)
    expected_protein = models.FloatField(default=0)
    summary_carbohydrates = models.FloatField(default=0)
    expected_carbohydrates = models.FloatField(default=0)
    summary_fats = models.FloatField(default=0)
    expected_fats = models.FloatField(default=0)
    water = models.IntegerField(default=0)
    expected_water = models.IntegerField(default=0)
    steps = models.IntegerField(default=0)
    expected_steps = models.IntegerField(default=0)
    activity_time = models.IntegerField(default=0)
    weight = models.FloatField()
    pulse = models.IntegerField(default=60)
    meal_set = models.OneToOneField('MealSet', on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

class MealSet(models.Model):
    id = models.AutoField(primary_key=True)

class MealType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=60)

class Meal(models.Model):
    id = models.AutoField(primary_key=True)
    summary_kcal = models.FloatField(default=0)
    summary_portion = models.FloatField(default=0)
    summary_protein = models.FloatField(default=0)
    summary_carbohydrates = models.FloatField(default=0)
    summary_fats = models.FloatField(default=0)
    meal_type = models.ForeignKey('MealType', on_delete=models.CASCADE)
    meal_set = models.ForeignKey('MealSet', on_delete=models.CASCADE)

class MealProduct(models.Model):
    id = models.AutoField(primary_key=True)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    meal = models.ForeignKey('Meal', on_delete=models.CASCADE)
    portion = models.FloatField()
    kcal = models.FloatField()
    protein = models.FloatField()
    carbohydrates = models.FloatField()
    fats = models.FloatField()

class Training(models.Model):
    id = models.AutoField(primary_key=True)
    time = models.IntegerField()
    lose_kcal = models.FloatField()
    notes = models.CharField(max_length=255, blank=True, null=True)
    physical_activity = models.ForeignKey('PhysicalActivity', on_delete=models.CASCADE, blank=True, null=True)
    day = models.ForeignKey('Day', on_delete=models.CASCADE)

class PhysicalActivity(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=60)
    description = models.CharField(max_length=60, blank=True, null=True)
    met = models.FloatField(max_length=60)
    image_class = models.CharField(max_length=60)
    