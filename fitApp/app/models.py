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

class Dish(models.Model):
    name = models.CharField(max_length=60)
    summary_kcal = models.FloatField()
    summary_protein = models.FloatField()
    summary_carbohydrates = models.FloatField()
    summary_fats = models.FloatField()
    summary_water = models.IntegerField()
    products = models.ManyToManyField('Product')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=60)
    manufacturer = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
class Nutrientes(models.Model):
    kcal = models.FloatField()
    protein = models.FloatField()
    carbohydrates = models.FloatField()
    fats = models.FloatField()
    portion = models.FloatField()
    is_portion = models.BooleanField(default=False)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)

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
    meals = models.ForeignKey('Meal', on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

class Meal(models.Model):
    type = models.CharField(max_length=60)
    summary_kcal = models.FloatField()
    summary_protein = models.FloatField()
    summary_carbohydrates = models.FloatField()
    summary_fats = models.FloatField()
    products = models.ManyToManyField('Product')
    dishes = models.ManyToManyField('Dish')

class Training(models.Model):
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
    