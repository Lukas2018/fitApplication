from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from app.forms import LoginForm, RegisterForm, UserDataForm, PasswordChangeForm, ProductForm
from app.models import Product, Day
from app.basic_functions import convert_seconds_to_time_string
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpResponse
import datetime
import json
import math

@login_required
def index(request):
    user = request.user
    date = datetime.datetime.now()
    if request.GET.dict():
        day_param = request.GET.dict()['date']
        year = int(day_param.split('-')[0])
        month = int(day_param.split('-')[1])
        day = int(day_param.split('-')[2])
        date = datetime.date(year, month, day)
    day = user.day_set.filter(date=date).first()
    if day is None:
        previous_day = user.day_set.filter(date__lte=date).order_by('-date').first()
        next_day = user.day_set.filter(date__gte=date).order_by('date').first()
        if previous_day is not None:
            day = Day(date=date, weight=previous_day.weight, pulse=previous_day.pulse, 
                        expected_kcal=previous_day.expected_kcal, expected_protein = previous_day.expected_protein, 
                        expected_carbohydrates = previous_day.expected_carbohydrates, expected_fats = previous_day.expected_fats,
                        expected_water = previous_day.expected_water, expected_steps = previous_day.expected_steps, user=user)
        elif next_day is not None:
            day = Day(date=date, weight=next_day.weight, pulse=next_day.pulse, 
                        expected_kcal=next_day.expected_kcal, expected_protein = next_day.expected_protein, 
                        expected_carbohydrates = next_day.expected_carbohydrates, expected_fats = next_day.expected_fats,
                        expected_water = next_day.expected_water, expected_steps = next_day.expected_steps, user=user)
        else:
            day = Day(date=date, weight=user.userprofile.weight, pulse=user.userprofile.pulse, 
                        expected_kcal=user.userprofile.kcal, expected_protein = user.userprofile.protein, 
                        expected_carbohydrates = user.userprofile.carbohydrates, expected_fats = user.userprofile.fats,
                        expected_water = user.userprofile.water, expected_steps = user.userprofile.steps, user=user)
        day.save()
    empty_bottles = math.ceil((day.expected_water - day.water)/250)
    full_bottles = math.ceil(day.expected_water / 250) - empty_bottles
    context = {
        'empty_loop_times': range(1, empty_bottles + 1),
        'full_loop_times': range(1, full_bottles + 1),
        'day': day,
        'workout_time': convert_seconds_to_time_string(day.activity_time)
    }
    return render(request, 'index.html', context)

def login(request):
    form = LoginForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(username=email, email=email, password=password)
            if user is not None:
                auth_login(request, user)
                if user.userprofile.first_login == 1:
                    return redirect('/user_data')
                return redirect('/index')
    context = {
        'form': form,
    }
    return render(request, 'login.html', context)

def logout(request):
    auth_logout(request)
    return redirect('/login')

def register(request):
    form = RegisterForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = User.objects.create_user(username=email, email=email, password=password)
            return redirect('/login')
    context = {
        'form': form
    }
    return render(request, 'register.html', context)

def user_data(request):
    form = UserDataForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = request.user
            user.userprofile.age = form.cleaned_data['age']
            user.userprofile.weight = form.cleaned_data['weight']
            user.userprofile.height = form.cleaned_data['height']
            user.userprofile.sex = form.cleaned_data['sex']
            user.userprofile.kcal = form.cleaned_data['kcal']
            user.userprofile.protein = form.cleaned_data['protein']
            user.userprofile.carbohydrates = form.cleaned_data['carbohydrates']
            user.userprofile.fats = form.cleaned_data['fats']
            user.userprofile.water = form.cleaned_data['water']
            user.userprofile.steps = form.cleaned_data['steps']
            user.userprofile.first_login = 0
            user.userprofile.pulse = 60
            user.save()
            day = Day(date=datetime.datetime.now(), weight=user.userprofile.weight, pulse=user.userprofile.pulse, 
                        expected_kcal=user.userprofile.kcal, expected_protein = user.userprofile.protein, 
                        expected_carbohydates = user.userprofile.carbohydrates, expected_fats = user.userprofile.fats,
                        expected_water = user.userprofile.water, expected_steps = user.userprofile.steps, user=user)
            day.save()
            return redirect('/index')
    context = {
        'form': form
    }
    return render(request, 'user_data.html', context)

def calendar(request):
    return render(request, 'calendar.html')

def analyze(request):
    return render(request, 'analyze.html')
    
def user_panel(request):
    return render(request, 'user_panel.html')

def password_change(request):
    user = request.user
    form = PasswordChangeForm(user, request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            new_password = form.cleaned_data['new_password']
            user.set_password(new_password)
            user.save()
            return redirect('/user_panel')
    context = {
        'form': form
    }
    return render(request, 'password_change.html', context)

def product(request):
    form = ProductForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            product = Product()
            product.name = form.cleaned_data['name']
            product.manufacturer = form.cleaned_data['manufacturer']
            product.kcal = form.cleaned_data['kcal']
            product.protein = form.cleaned_data['protein']
            product.carbohydrates = form.cleaned_data['carbohydrates']
            product.fats = form.cleaned_data['fats']
            return redirect('/index')
    context = {
        'form': form
    }
    return render(request, 'product_create.html', context)

def save_index_data(request):
    if request.method == 'POST':
        user = request.user
        data = request._post
        year = int(data['date'].split('-')[0])
        month = int(data['date'].split('-')[1])
        day = int(data['date'].split('-')[2])
        date = datetime.date(year, month, day)
        day = user.day_set.filter(date=date).first()
        user.userprofile.weight = float(data['weight'])
        user.userprofile.pulse = int(data['pulse'])
        day.weight = float(data['weight'])
        day.pulse = int(data['pulse'])
        day.water = int(data['water'])
        user.save()
        day.save()
    return HttpResponse('OK', status=200)
        

def save_weight(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            user.userprofile.weight = float(data['weight'])
            day.weight = float(data['weight'])
            user.save()
            day.save()
    return HttpResponse('OK', status=200)

def save_pulse(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            user.userprofile.pulse = int(data['pulse'])
            day.pulse = int(data['pulse'])
            user.save()
            day.save()
    return HttpResponse('OK', status=200)

def save_water(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            data = json.loads(request.body)
            year = int(data['date'].split('-')[0])
            month = int(data['date'].split('-')[1])
            day = int(data['date'].split('-')[2])
            date = datetime.date(year, month, day)
            day = user.day_set.filter(date=date).first()
            day.water = int(data['water'])
            user.save()
            day.save()
    return HttpResponse('OK', status=200)

def get_day_data(request):
    if request.is_ajax():
        if request.method == 'GET':
            user = request.user
            date = json.loads(list(request.GET.dict().keys())[0])['date']
            year = int(date.split('-')[0])
            month = int(date.split('-')[1])
            day = int(date.split('-')[2])
            day = user.day_set.filter(date=datetime.datetime(year, month, day)).first()
            if day is None:
                return HttpResponse(status=204)
            data = {
                'kcal': day.summary_kcal,
                'expected_kcal': day.expected_kcal,
                'lose_kcal': day.lose_kcal,
                'protein': day.summary_protein,
                'expected_protein': day.expected_protein,
                'carbohydrates': day.summary_carbohydrates,
                'expected_carbohydrates': day.expected_carbohydrates,
                'fats': day.summary_fats,
                'expected_fats': day.expected_fats,
                'water': day.water,
                'expected_water': day.expected_water,
                'steps': day.steps,
                'expected_steps': day.expected_steps,
                'workout': convert_seconds_to_time_string(day.activity_time),
                'weight': day.weight,
                'pulse': day.pulse,
            }
            data = json.dumps(data)
            return HttpResponse(data, content_type='application/json', status=200)

def get_day_specific_data(request):
    if request.is_ajax():
        if request.method == 'GET':
            user = request.user
            data = json.loads(list(request.GET.dict().keys())[0])
            left_date = data['leftDate']
            right_date = data['rightDate']
            left_year = int(left_date.split('-')[0])
            left_month = int(left_date.split('-')[1])
            left_day = int(left_date.split('-')[2])
            right_year = int(right_date.split('-')[0])
            right_month = int(right_date.split('-')[1])
            right_day = int(right_date.split('-')[2])
            data_type = data['type']
            data = {}
            last_non_null_value = user.day_set.filter(date__lte=datetime.date(left_year, left_month, left_day)).order_by('-date').first()
            start_date = datetime.date(left_year, left_month, left_day)
            end_date = datetime.date(right_year, right_month, right_day)
            delta = datetime.timedelta(days=1)
            summary = None
            expected = None
            while start_date <= end_date:
                day = user.day_set.filter(date=start_date).first()
                date = start_date.strftime("%Y-%m-%d")
                if day is not None:
                    if data_type == 'kcal':
                        summary = day.summary_kcal
                        expected = day.expected_kcal
                    elif data_type == 'protein':
                        summary = day.summary_protein
                        expected = day.expected_protein
                    elif data_type == 'carbohydrates':
                        summary = day.summary_carbohydrates,
                        expected = day.expected_carbohydrates
                    elif data_type == 'fats':
                        summary = day.summary_fats,
                        expected = day.expected_fats
                    elif data_type == 'steps':
                        summary = day.steps,
                        expected = day.expected_steps
                    elif data_type == 'workout':
                        summary = day.activity_time
                    elif data_type == 'water':
                        summary = day.water,
                        expected = day.expected_water
                    elif data_type == 'weight':
                        summary = day.weight
                    elif data_type == 'pulse':
                        summary = day.pulse
                    last_non_null_value = day
                else:
                    if last_non_null_value is not None:
                        if data_type == 'weight':
                            summary = last_non_null_value.weight
                        elif data_type == 'pulse':
                            summary = last_non_null_value.pulse
                        elif data_type == 'kcal':
                            summary = 0
                            expected = last_non_null_value.expected_kcal
                        elif data_type == 'protein':
                            summary = 0
                            expected = last_non_null_value.expected_protein
                        elif data_type == 'carbohydrates':
                            summary = 0
                            expected = last_non_null_value.expected_carbohydrates
                        elif data_type == 'fats':
                            summary = 0
                            expected = last_non_null_value.expected_fats
                        elif data_type == 'steps':
                            summary = 0
                            expected = last_non_null_value.expected_steps
                        elif data_type == 'water':
                            summary = 0
                            expected = last_non_null_value.expected_water
                    else:
                        if data_type != 'weight' and data_type != 'pulse':
                            summary = 0
                if summary is not None and expected is not None:
                    data[date] = {
                        'summary': summary,
                        'expected': expected
                    }
                elif summary is not None:
                    data[date] = {
                        'summary': summary
                    }
                start_date += delta
            data = json.dumps(data)
            return HttpResponse(data, content_type='application/json', status=200)