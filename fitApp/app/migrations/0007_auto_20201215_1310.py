# Generated by Django 3.0.6 on 2020-12-15 12:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_remove_meal_products'),
    ]

    operations = [
        migrations.AddField(
            model_name='mealproduct',
            name='carbohydrates',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='mealproduct',
            name='fats',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='mealproduct',
            name='kcal',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='mealproduct',
            name='protein',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
    ]
