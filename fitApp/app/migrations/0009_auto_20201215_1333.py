# Generated by Django 3.0.6 on 2020-12-15 12:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_auto_20201215_1332'),
    ]

    operations = [
        migrations.RenameField(
            model_name='day',
            old_name='meals',
            new_name='meal_set',
        ),
    ]