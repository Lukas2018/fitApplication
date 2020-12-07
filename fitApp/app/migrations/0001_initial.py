# Generated by Django 3.0.6 on 2020-12-07 10:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Day',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('summary_kcal', models.FloatField(default=0)),
                ('expected_kcal', models.FloatField(default=0)),
                ('lose_kcal', models.FloatField(default=0)),
                ('summary_protein', models.FloatField(default=0)),
                ('expected_protein', models.FloatField(default=0)),
                ('summary_carbohydrates', models.FloatField(default=0)),
                ('expected_carbohydrates', models.FloatField(default=0)),
                ('summary_fats', models.FloatField(default=0)),
                ('expected_fats', models.FloatField(default=0)),
                ('water', models.IntegerField(default=0)),
                ('expected_water', models.IntegerField(default=0)),
                ('steps', models.IntegerField(default=0)),
                ('expected_steps', models.IntegerField(default=0)),
                ('activity_time', models.IntegerField(default=0)),
                ('weight', models.FloatField()),
                ('pulse', models.IntegerField(default=60)),
            ],
        ),
        migrations.CreateModel(
            name='Dish',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
                ('summary_kcal', models.FloatField()),
                ('summary_protein', models.FloatField()),
                ('summary_carbohydrates', models.FloatField()),
                ('summary_fats', models.FloatField()),
                ('summary_water', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='PhysicalActivity',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=60)),
                ('description', models.CharField(blank=True, max_length=60, null=True)),
                ('met', models.FloatField(max_length=60)),
                ('image_class', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_login', models.IntegerField(default=1)),
                ('age', models.IntegerField(blank=True, null=True)),
                ('sex', models.CharField(blank=True, max_length=1, null=True)),
                ('weight', models.FloatField(blank=True, null=True)),
                ('pulse', models.IntegerField(blank=True, null=True)),
                ('height', models.FloatField(blank=True, null=True)),
                ('kcal', models.IntegerField(blank=True, null=True)),
                ('protein', models.FloatField(blank=True, null=True)),
                ('carbohydrates', models.FloatField(blank=True, null=True)),
                ('fats', models.FloatField(blank=True, null=True)),
                ('water', models.IntegerField(blank=True, null=True)),
                ('steps', models.IntegerField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Training',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.IntegerField()),
                ('lose_kcal', models.FloatField()),
                ('notes', models.CharField(blank=True, max_length=255, null=True)),
                ('day', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Day')),
                ('physical_activity', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.PhysicalActivity')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=60)),
                ('manufacturer', models.TextField()),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Nutrientes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kcal', models.FloatField()),
                ('protein', models.FloatField()),
                ('carbohydrates', models.FloatField()),
                ('fats', models.FloatField()),
                ('portion', models.FloatField()),
                ('is_portion', models.BooleanField(default=False)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Product')),
            ],
        ),
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=60)),
                ('summary_kcal', models.FloatField()),
                ('summary_protein', models.FloatField()),
                ('summary_carbohydrates', models.FloatField()),
                ('summary_fats', models.FloatField()),
                ('dishes', models.ManyToManyField(to='app.Dish')),
                ('products', models.ManyToManyField(to='app.Product')),
            ],
        ),
        migrations.AddField(
            model_name='dish',
            name='products',
            field=models.ManyToManyField(to='app.Product'),
        ),
        migrations.AddField(
            model_name='dish',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='day',
            name='meals',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.Meal'),
        ),
        migrations.AddField(
            model_name='day',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
