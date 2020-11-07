from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from app.forms import LoginForm, RegisterForm, UserDataForm, PasswordChangeForm, ProductForm
from app.models import Product, Day
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpResponse
from datetime import datetime
import json
import math

@login_required
def index(request):
    user = request.user
    day = user.day_set.filter(date=datetime.now()).first()
    if day is None:
        day = Day(date=datetime.now(), weight=user.userprofile.weight, pulse=user.userprofile.pulse, user=user)
        day.save()
    empty_bottles = math.ceil((user.userprofile.water - day.water)/250)
    full_bottles = math.ceil(user.userprofile.water / 250) - empty_bottles
    context = {
        'empty_loop_times': range(1, empty_bottles + 1),
        'full_loop_times': range(1, full_bottles + 1),
        'day': day
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
                if user.day_set.filter(date=datetime.now()) is None:
                    day = Day(date=datetime.now(), weight=user.userprofile.weight, pulse=user.userprofile.pulse, user=user)
                    day.save()
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
            user.save()
            day = Day(date=datetime.now(), weight=user.userprofile.weight, pulse=user.userprogile.pulse, user=user)
            day.save()
            return redirect('/index')
    context = {
        'form': form
    }
    return render(request, 'user_data.html', context)

def calendar(request):
    return render(request, 'calendar.html')
    
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
        day = user.day_set.filter(date=datetime.now()).first() #to do pass date in json 
        data = request._post
        user.userprofile.weight = data['weight']
        user.userprofile.pulse = data['pulse']
        day.weight = data['weight']
        day.pulse = data['pulse']
        day.water = data['water']
        user.save()
        day.save()
    return HttpResponse('OK', status=200)
        

def save_weight(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            day = user.day_set.filter(date=datetime.now()).first() #to do pass date in json 
            data = json.loads(request.body)
            user.userprofile.weight = data['weight']
            day.weight = data['weight']
            user.save()
            day.save()
    return HttpResponse('OK', status=200)

def save_pulse(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            day = user.day_set.filter(date=datetime.now()).first() #to do pass date in json 
            data = json.loads(request.body)
            user.userprofile.pulse = data['pulse']
            day.pulse = data['pulse']
            user.save()
            day.save()
    return HttpResponse('OK', status=200)

def save_water(request):
    if request.is_ajax():
        if request.method == 'POST':
            user = request.user
            day = user.day_set.filter(date=datetime.now()).first() #to do pass date in json 
            data = json.loads(request.body)
            day.water = data['water']
            user.save()
            day.save()
    return HttpResponse('OK', status=200)

def get_day_data(request):
    if request.is_ajax():
        if request.method == 'GET':
            user = request.user
            data = json.loads(list(request.GET.dict().keys())[0])
            day = data['day']
            month = data['month']
            year = data['year']
            date = datetime(year, month, day)
            day = user.day_set.filter(date=date).first()
            if day is None:
                return HttpResponse(status=204)
            data = {
                'kcal': day.summary_kcal,
                'protein': day.summary_protein,
                'carbohydrates': day.summary_carbohydrates,
                'fats': day.summary_fats,
                'water': day.water,
                'steps': day.steps,
                'weight': day.weight,
                'pulse': day.pulse,
            }
            data = json.dumps(data)
            return HttpResponse(data, content_type='application/json', status=200)